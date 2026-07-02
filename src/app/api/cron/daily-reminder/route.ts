import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendDailyReminderEmail } from "@/lib/emails/daily-reminder";
import { sendPushToUser } from "@/lib/push-server";

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

  const { data: allProfiles } = await admin
    .from("profiles")
    .select("id, email, timezone, reminder_hour, reminder_enabled, plan_status, current_period_end, cancel_at_period_end");

  // ─── Échéances d'abonnement : push unique ~3 jours avant la fin ────────────
  // (essai qui se termine, ou abonnement annulé qui expire) — envoyé à 18h locale
  let expirySent = 0;
  for (const p of allProfiles ?? []) {
    if (!p.current_period_end || localHour(now, p.timezone) !== 18) continue;
    const remainingDays = (new Date(p.current_period_end).getTime() - now.getTime()) / 86400000;
    if (remainingDays <= 2 || remainingDays > 3) continue;

    const isTrialEnding = p.plan_status === "trialing";
    const isCancelExpiring = p.plan_status === "active" && p.cancel_at_period_end;
    if (!isTrialEnding && !isCancelExpiring) continue;

    try {
      const sent = await sendPushToUser(admin, p.id, {
        title: "Ancrage",
        body: isTrialEnding
          ? "Ton essai gratuit se termine dans 3 jours. Ton abonnement démarrera ensuite automatiquement."
          : "Ton accès illimité se termine dans 3 jours. Tu peux te réabonner à tout moment.",
        url: "/parametres",
      });
      expirySent += sent > 0 ? 1 : 0;
    } catch (err) {
      console.error("[cron/daily-reminder] push échéance échoué:", p.id, err);
    }
  }

  const profiles = (allProfiles ?? []).filter((p) => p.reminder_enabled);
  const candidates = profiles.filter((p) => localHour(now, p.timezone) === p.reminder_hour);
  if (candidates.length === 0) {
    return NextResponse.json({ sent: 0, expirySent });
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
      // Push d'abord (si l'utilisateur a un appareil abonné), email en plus.
      const pushed = await sendPushToUser(admin, profile.id, {
        title: "Ancrage",
        body: "Comment s'est passée ta journée ? Trois minutes pour la déposer.",
        url: "/journal",
      });
      await sendDailyReminderEmail(profile.email, appUrl);
      sent++;
      if (pushed > 0) console.log("[cron/daily-reminder] push envoyé:", profile.id);
    } catch (err) {
      console.error("[cron/daily-reminder] envoi échoué:", profile.id, err);
    }
  }

  return NextResponse.json({ sent, expirySent });
}
