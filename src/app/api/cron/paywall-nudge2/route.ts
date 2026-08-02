import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isPremiumStatus } from "@/lib/free-messages";
import { sendPaywallNudge2Email } from "@/lib/emails/paywall-nudge2";
import { sendPushToUser } from "@/lib/push-server";

export const runtime = "nodejs";

const DAY = 86400000;

// 2e relance automatique : ~3 jours après la 1re (paywall_notified_at), pour les
// comptes toujours gratuits qui n'ont pas encore reçu la 2e relance. Envoyée une
// seule fois (marqueur paywall_nudge2_at). Fenêtre 3–21 jours pour éviter les
// comptes trop anciens.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const now = Date.now();

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, plan_status, paywall_notified_at, paywall_nudge2_at");

  const sent: string[] = [];

  for (const p of profiles ?? []) {
    if (isPremiumStatus(p.plan_status)) continue;
    if (!p.email || !p.paywall_notified_at || p.paywall_nudge2_at) continue;

    const ageDays = (now - new Date(p.paywall_notified_at).getTime()) / DAY;
    if (ageDays < 3 || ageDays > 21) continue;

    try {
      await sendPushToUser(admin, p.id, {
        title: "Ton 1er mois à 1 € 🌙",
        body: "Tu hésites encore ? Ton premier mois reste à 1 €, sans engagement.",
        url: "/paywall",
      });
      await sendPaywallNudge2Email(p.email, appUrl, p.id, `relance2-${p.id}`);
      await admin.from("profiles").update({ paywall_nudge2_at: new Date().toISOString() }).eq("id", p.id);
      sent.push(p.email);
    } catch (err) {
      console.error("[cron/paywall-nudge2] échec:", p.id, err);
    }
  }

  return NextResponse.json({ sent, count: sent.length });
}
