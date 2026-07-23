function apiUrl(method: string): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("Missing TELEGRAM_BOT_TOKEN");
  return `https://api.telegram.org/bot${token}/${method}`;
}

export async function sendTelegramMessage(chatId: number | string, text: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });
    if (!res.ok) {
      console.error("Telegram sendMessage failed", res.status, await res.text());
    }
    return res.ok;
  } catch (err) {
    console.error("Telegram sendMessage error", err);
    return false;
  }
}

export function mapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/** Deep link that opens a chat with the bot and auto-sends "/start <tagId>". */
export function telegramStartLink(tagId: string): string | null {
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  if (!username) return null;
  return `https://t.me/${username}?start=${tagId}`;
}
