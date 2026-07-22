import { NextRequest, NextResponse } from "next/server";
import { cleanupOldSessions } from "@/lib/db";

const MAX_AGE_MS = 48 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const deleted = await cleanupOldSessions(Date.now() - MAX_AGE_MS);
  return NextResponse.json({ deleted });
}
