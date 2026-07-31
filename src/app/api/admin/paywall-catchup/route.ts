import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { FREE_MESSAGE_LIMIT, isPremiumStatus } from "@/lib/free-messages";
import { sendPaywallNudgeEmail } from "@/lib/emails/paywall-nudge";
import { sendPushToUser } from "@/lib/push-server";

export const runtime = "nodejs";

// Rattrapage : relance (email + push) tous les comptes gratuits ayant déjà
// épuisé leurs confidences mais jamais relancés. Une seule fois par compte.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, plan_status, paywall_notified_at");

  const nudged: string[] = [];

  for (const p of profiles ?? []) {
    if (isPremiumStatus(p.plan_status) || p.paywall_notified_at) continue;

    const { count } = await admin
      .from("entry_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", p.id)
      .eq("role", "user");

    if ((count ?? 0) < FREE_MESSAGE_LIMIT) continue;

    try {
      await sendPushToUser(admin, p.id, {
        title: "Continue d'écrire, sans limite 🌙",
        body: "Tes 10 confidences offertes sont utilisées. 3 jours d'essai offerts pour continuer.",
        url: "/paywall",
      });
      if (p.email) await sendPaywallNudgeEmail(p.email, appUrl);
      await admin.from("profiles").update({ paywall_notified_at: new Date().toISOString() }).eq("id", p.id);
      nudged.push(p.email ?? p.id);
    } catch (err) {
      console.error("[paywall-catchup] échec:", p.id, err);
    }
  }

  return NextResponse.json({ nudged, count: nudged.length });
}
