import { NextRequest, NextResponse } from "next/server";
import { addMessage, getProfile, getProfileByChatId, setGuardianChat } from "@/lib/db";
import { sendTelegramMessage } from "@/lib/telegram";

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
  };
}

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const header = req.headers.get("x-telegram-bot-api-secret-token");
    if (header !== secret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const update = (await req.json().catch(() => null)) as TelegramUpdate | null;
  const message = update?.message;
  if (!message?.text) {
    return NextResponse.json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();

  if (text.startsWith("/start")) {
    const parts = text.split(/\s+/);
    const tagId = parts[1];
    if (!tagId) {
      await sendTelegramMessage(
        chatId,
        "Hola. Para vincular tu cuenta, abre el enlace especial que te dieron para tu etiqueta (incluye un código al final)."
      );
      return NextResponse.json({ ok: true });
    }
    const profile = await getProfile(tagId);
    if (!profile) {
      await sendTelegramMessage(chatId, "No se encontró ninguna etiqueta con ese código.");
      return NextResponse.json({ ok: true });
    }
    await setGuardianChat(tagId, chatId);
    await sendTelegramMessage(
      chatId,
      `✅ Vinculado correctamente a <b>${profile.firstName}</b>. Si alguien escanea su etiqueta, recibirás un mensaje aquí con su ubicación, y podrás responderle escribiendo directamente en este chat.`
    );
    return NextResponse.json({ ok: true });
  }

  const profile = await getProfileByChatId(chatId);
  if (!profile) {
    await sendTelegramMessage(
      chatId,
      "Este chat de Telegram no está vinculado a ninguna etiqueta todavía."
    );
    return NextResponse.json({ ok: true });
  }

  if (!profile.activeSessionId) {
    await sendTelegramMessage(chatId, "No hay ninguna búsqueda activa en este momento.");
    return NextResponse.json({ ok: true });
  }

  await addMessage(profile.activeSessionId, "guardian", text);
  return NextResponse.json({ ok: true });
}
