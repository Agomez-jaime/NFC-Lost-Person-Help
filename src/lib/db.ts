import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getDb } from "./firebaseAdmin";
import { generateId } from "./ids";

export interface ProfilePublic {
  firstName: string;
  careNote: string;
  photoUrl?: string;
  emergencyPhone?: string;
}

export interface Profile extends ProfilePublic {
  tagId: string;
  editToken?: string;
  /** Every Telegram chat currently receiving alerts for this tag. Merges the
   * legacy single `guardianChatId` field (from before multi-guardian support)
   * with the newer `guardianChatIds` array, so old profiles keep working
   * without any migration. */
  guardianChatIds: number[];
  activeSessionId?: string;
  active: boolean;
}

export interface Message {
  sender: "finder" | "guardian";
  text: string;
  createdAt: number;
}

function profilesCol() {
  return getDb().collection("profiles");
}

function sessionsCol() {
  return getDb().collection("sessions");
}

function toProfile(tagId: string, data: FirebaseFirestore.DocumentData): Profile {
  const ids = new Set<number>(Array.isArray(data.guardianChatIds) ? data.guardianChatIds : []);
  if (typeof data.guardianChatId === "number") ids.add(data.guardianChatId);

  return {
    tagId,
    editToken: data.editToken,
    firstName: data.firstName,
    careNote: data.careNote,
    photoUrl: data.photoUrl,
    emergencyPhone: data.emergencyPhone,
    guardianChatIds: [...ids],
    activeSessionId: data.activeSessionId,
    active: data.active !== false,
  };
}

export async function getProfile(tagId: string): Promise<Profile | null> {
  const snap = await profilesCol().doc(tagId).get();
  if (!snap.exists) return null;
  return toProfile(tagId, snap.data()!);
}

export async function getProfilePublic(tagId: string): Promise<ProfilePublic | null> {
  const profile = await getProfile(tagId);
  if (!profile || !profile.active) return null;
  const { firstName, careNote, photoUrl, emergencyPhone } = profile;
  return { firstName, careNote, photoUrl, emergencyPhone };
}

export async function listProfiles(): Promise<Profile[]> {
  const snap = await profilesCol().get();
  return snap.docs.map((d) => toProfile(d.id, d.data()));
}

export async function createProfile(input: {
  tagId?: string;
  firstName: string;
  careNote: string;
  photoUrl?: string;
  emergencyPhone?: string;
}): Promise<Profile> {
  const tagId = input.tagId || generateId(6);
  const data = {
    editToken: generateId(9),
    firstName: input.firstName,
    careNote: input.careNote,
    photoUrl: input.photoUrl ?? null,
    emergencyPhone: input.emergencyPhone ?? null,
    active: true,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  await profilesCol().doc(tagId).set(data);
  return toProfile(tagId, data);
}

export async function updateProfile(
  tagId: string,
  patch: Partial<{
    firstName: string;
    careNote: string;
    photoUrl: string | null;
    emergencyPhone: string | null;
    active: boolean;
  }>
): Promise<void> {
  await profilesCol()
    .doc(tagId)
    .set({ ...patch, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}

export async function getProfileByEditToken(editToken: string): Promise<Profile | null> {
  const snap = await profilesCol().where("editToken", "==", editToken).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return toProfile(doc.id, doc.data());
}

/** Backfills an editToken for profiles created before this field existed. */
export async function ensureEditToken(tagId: string, current?: string): Promise<string> {
  if (current) return current;
  const token = generateId(9);
  await profilesCol().doc(tagId).set({ editToken: token }, { merge: true });
  return token;
}

export async function getProfileByChatId(chatId: number): Promise<Profile | null> {
  const arraySnap = await profilesCol().where("guardianChatIds", "array-contains", chatId).limit(1).get();
  if (!arraySnap.empty) {
    const doc = arraySnap.docs[0];
    return toProfile(doc.id, doc.data());
  }
  // Fallback for profiles linked before guardianChatIds existed.
  const legacySnap = await profilesCol().where("guardianChatId", "==", chatId).limit(1).get();
  if (legacySnap.empty) return null;
  const doc = legacySnap.docs[0];
  return toProfile(doc.id, doc.data());
}

/** Adds a Telegram chat to a tag's recipient list without removing anyone
 * already linked (including via the legacy single-chat field). */
export async function addGuardianChat(tagId: string, chatId: number): Promise<void> {
  const profile = await getProfile(tagId);
  const ids = new Set(profile?.guardianChatIds ?? []);
  ids.add(chatId);
  await profilesCol()
    .doc(tagId)
    .set({ guardianChatIds: [...ids] }, { merge: true });
}

export async function setActiveSession(tagId: string, sessionId: string): Promise<void> {
  await profilesCol().doc(tagId).set({ activeSessionId: sessionId }, { merge: true });
}

export async function createSession(tagId: string): Promise<string> {
  const sessionId = generateId(12);
  await sessionsCol().doc(sessionId).set({
    tagId,
    createdAt: FieldValue.serverTimestamp(),
    location: null,
  });
  return sessionId;
}

export async function getSession(
  sessionId: string
): Promise<{ tagId: string; location: { lat: number; lng: number } | null } | null> {
  const snap = await sessionsCol().doc(sessionId).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return { tagId: data.tagId, location: data.location ?? null };
}

export async function setSessionLocation(
  sessionId: string,
  location: { lat: number; lng: number; accuracy?: number }
): Promise<void> {
  await sessionsCol()
    .doc(sessionId)
    .set(
      {
        location: {
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy ?? null,
          capturedAt: FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );
}

export async function addMessage(
  sessionId: string,
  sender: "finder" | "guardian",
  text: string
): Promise<void> {
  await sessionsCol().doc(sessionId).collection("messages").add({
    sender,
    text,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  const snap = await sessionsCol()
    .doc(sessionId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .get();
  return snap.docs.map((d) => {
    const data = d.data();
    const createdAt: Timestamp | undefined = data.createdAt;
    return {
      sender: data.sender,
      text: data.text,
      createdAt: createdAt ? createdAt.toMillis() : Date.now(),
    };
  });
}

/** Deletes sessions (and their messages) older than cutoffMillis. Returns count deleted. */
export async function cleanupOldSessions(cutoffMillis: number): Promise<number> {
  const cutoff = Timestamp.fromMillis(cutoffMillis);
  const snap = await sessionsCol().where("createdAt", "<", cutoff).get();
  let deleted = 0;
  for (const doc of snap.docs) {
    const messages = await doc.ref.collection("messages").get();
    const batch = getDb().batch();
    messages.docs.forEach((m) => batch.delete(m.ref));
    batch.delete(doc.ref);
    await batch.commit();

    const data = doc.data();
    if (data.tagId) {
      const profileSnap = await profilesCol().doc(data.tagId).get();
      if (profileSnap.exists && profileSnap.data()?.activeSessionId === doc.id) {
        await profilesCol()
          .doc(data.tagId)
          .set({ activeSessionId: FieldValue.delete() }, { merge: true });
      }
    }
    deleted += 1;
  }
  return deleted;
}
