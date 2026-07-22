import { NextRequest, NextResponse } from "next/server";
import { getProfilePublic } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  const { tagId } = await params;
  const profile = await getProfilePublic(tagId);
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(profile);
}
