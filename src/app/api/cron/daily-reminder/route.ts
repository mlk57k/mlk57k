import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendDailyReminderEmail } from "@/lib/emails/daily-reminder";

export const runtime = "nodejs";

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function localHour(date: Date, timeZone: string): number {
  const hourStr = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", hour12: false }).format(date);
  return parseInt(hourStr, 10) % 24;
}

function localDateKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);
}

/**
 * Exécuté toutes les heures. Envoie un rappel uniquement aux profils dont
 * l'heure locale correspond à reminder_hour, et qui n'ont pas déjà écrit
 * aujourd'hui (dans leur fuseau horaire) — jamais de relance après coup.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const admin = getAdminClient();
  const now = new Date();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, timezone, reminder_hour")
    .eq("reminder_enabled", true);

  const candidates = (profiles ?? []).filter((p) => localHour(now, p.timezone) === p.reminder_hour);
  if (candidates.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const candidateIds = candidates.map((p) => p.id);
  const since = new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString();
  const { data: recentEntries } = await admin
    .from("journal_entries")
    .select("user_id, created_at")
    .in("user_id", candidateIds)
    .gte("created_at", since);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  let sent = 0;

  for (const profile of candidates) {
    const todayKey = localDateKey(now, profile.timezone);
    const alreadyJournaled = (recentEntries ?? []).some(
      (e) => e.user_id === profile.id && localDateKey(new Date(e.created_at), profile.timezone) === todayKey
    );
    if (alreadyJournaled) continue;

    try {
      await sendDailyReminderEmail(profile.email, appUrl);
      sent++;
    } catch (err) {
      console.error("[cron/daily-reminder] envoi échoué:", profile.id, err);
    }
  }

  return NextResponse.json({ sent });
}
