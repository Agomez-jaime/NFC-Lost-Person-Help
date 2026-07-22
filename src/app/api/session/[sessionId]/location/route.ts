import { NextRequest, NextResponse } from "next/server";
import { getProfile, getSession, setActiveSession, setSessionLocation } from "@/lib/db";
import { mapsLink, sendTelegramMessage } from "@/lib/telegram";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const body = await req.json().catch(() => null);
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);
  const accuracy = body?.accuracy != null ? Number(body.accuracy) : undefined;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "invalid_location" }, { status: 400 });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const profile = await getProfile(session.tagId);
  const wasAlreadyActive = profile?.activeSessionId === sessionId;
  await setSessionLocation(sessionId, { lat, lng, accuracy });

  if (profile?.guardianChatId) {
    const link = mapsLink(lat, lng);
    const text = wasAlreadyActive
      ? `📍 Ubicación actualizada de quien encontró a <b>${escapeHtml(profile.firstName)}</b>:\n${link}`
      : `🆘 Alguien escaneó la etiqueta de <b>${escapeHtml(profile.firstName)}</b> y compartió su ubicación:\n${link}\n\nPuedes responder aquí mismo y tu mensaje llegará a la persona que lo encontró.`;
    await sendTelegramMessage(profile.guardianChatId, text);
  }

  if (!wasAlreadyActive) {
    await setActiveSession(session.tagId, sessionId);
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
