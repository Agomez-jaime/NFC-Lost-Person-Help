import { NextRequest, NextResponse } from "next/server";
import { createSession, getProfile } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tagId = body?.tagId;
  if (typeof tagId !== "string" || !tagId) {
    return NextResponse.json({ error: "invalid_tagId" }, { status: 400 });
  }

  const profile = await getProfile(tagId);
  if (!profile || !profile.active) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const sessionId = await createSession(tagId);
  return NextResponse.json({ sessionId });
}
