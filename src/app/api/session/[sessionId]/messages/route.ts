import { NextRequest, NextResponse } from "next/server";
import { addMessage, getMessages, getProfile, getSession } from "@/lib/db";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const messages = await getMessages(sessionId);
  return NextResponse.json({ messages });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const body = await req.json().catch(() => null);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text || text.length > 1000) {
    return NextResponse.json({ error: "invalid_text" }, { status: 400 });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await addMessage(sessionId, "finder", text);

  const profile = await getProfile(session.tagId);
  if (profile?.guardianChatIds.length) {
    const notifyText = `💬 Mensaje de quien encontró a ${profile.firstName}:\n${text}`;
    await Promise.all(profile.guardianChatIds.map((chatId) => sendTelegramMessage(chatId, notifyText)));
  }

  return NextResponse.json({ ok: true });
}
