import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendInactiveReminderEmail } from "@/lib/emails/inactive-reminder";

export const runtime = "nodejs";

const INACTIVE_DAYS = 1; // 24h sans revenir
const DAY = 86400000;

/**
 * Relance de réengagement pour les inactifs.
 *
 * - En mode automatique (cron quotidien), ne cible QUE les personnes dont la
 *   dernière activité remonte à exactement 1–2 jours (24-48h) : chacun reçoit
 *   donc un seul rappel par période d'inactivité, sans colonne de suivi.
 * - `?all=1` : rattrapage ponctuel — vise tous les inactifs de 24h ou plus.
 *
 * Dédup côté Resend via une clé d'idempotence par jour (pas de double envoi).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const url = new URL(request.url);
  const catchup = url.searchParams.get("all") === "1";
  const days = Number(url.searchParams.get("days")) || INACTIVE_DAYS;

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, last_seen_at, created_at");

  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const sent: string[] = [];

  for (const p of profiles ?? []) {
    if (!p.email) continue;
    const last = new Date(p.last_seen_at ?? p.created_at).getTime();
    const ageDays = (now - last) / DAY;
    const inWindow = catchup ? ageDays >= days : ageDays >= days && ageDays < days + 1;
    if (!inWindow) continue;

    try {
      await sendInactiveReminderEmail(p.email, appUrl, `inactive-${p.id}-${today}`);
      sent.push(p.email);
    } catch (err) {
      console.error("[cron/inactive-reminder] échec:", p.id, err);
    }
  }

  return NextResponse.json({ sent, count: sent.length });
}
