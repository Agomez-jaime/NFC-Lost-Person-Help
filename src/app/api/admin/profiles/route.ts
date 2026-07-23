import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { createProfile, ensureEditToken, listProfiles } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const profiles = await listProfiles();
  // Profiles created before the family edit-link feature existed won't have
  // an editToken yet — backfill one the first time they're listed.
  const withTokens = await Promise.all(
    profiles.map(async (p) => ({ ...p, editToken: await ensureEditToken(p.tagId, p.editToken) }))
  );
  return NextResponse.json({ profiles: withTokens });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const careNote = typeof body?.careNote === "string" ? body.careNote.trim() : "";

  if (!firstName || !careNote) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const profile = await createProfile({
    firstName,
    careNote,
    photoUrl: typeof body?.photoUrl === "string" && body.photoUrl ? body.photoUrl : undefined,
    emergencyPhone:
      typeof body?.emergencyPhone === "string" && body.emergencyPhone ? body.emergencyPhone : undefined,
  });

  return NextResponse.json({ profile });
}
