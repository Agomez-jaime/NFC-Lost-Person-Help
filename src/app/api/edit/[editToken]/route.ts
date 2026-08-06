import { NextRequest, NextResponse } from "next/server";
import { getProfileByEditToken, updateProfile } from "@/lib/db";
import { telegramStartLink } from "@/lib/telegram";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ editToken: string }> }) {
  const { editToken } = await params;
  const profile = await getProfileByEditToken(editToken);
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    firstName: profile.firstName,
    careNote: profile.careNote,
    emergencyPhone: profile.emergencyPhone ?? "",
    telegramLinked: profile.guardianChatIds.length > 0,
    telegramLinkedCount: profile.guardianChatIds.length,
    telegramLinkUrl: telegramStartLink(profile.tagId),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ editToken: string }> }) {
  const { editToken } = await params;
  const profile = await getProfileByEditToken(editToken);
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const firstName = typeof body?.firstName === "string" ? body.firstName.trim() : "";
  const careNote = typeof body?.careNote === "string" ? body.careNote.trim() : "";

  if (!firstName || !careNote) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const patch: Parameters<typeof updateProfile>[1] = { firstName, careNote };
  if (typeof body?.emergencyPhone === "string") {
    patch.emergencyPhone = body.emergencyPhone.trim() || null;
  }
  await updateProfile(profile.tagId, patch);

  return NextResponse.json({ ok: true });
}
