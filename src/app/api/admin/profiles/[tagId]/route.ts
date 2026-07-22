import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getProfile, updateProfile } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { tagId } = await params;
  const existing = await getProfile(tagId);
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const patch: Record<string, unknown> = {};

  if (typeof body?.firstName === "string" && body.firstName.trim()) patch.firstName = body.firstName.trim();
  if (typeof body?.careNote === "string" && body.careNote.trim()) patch.careNote = body.careNote.trim();
  if (typeof body?.photoUrl === "string") patch.photoUrl = body.photoUrl.trim() || null;
  if (typeof body?.emergencyPhone === "string") patch.emergencyPhone = body.emergencyPhone.trim() || null;
  if (typeof body?.active === "boolean") patch.active = body.active;

  await updateProfile(tagId, patch);
  return NextResponse.json({ ok: true });
}
