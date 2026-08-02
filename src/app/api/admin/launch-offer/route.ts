import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { FREE_MESSAGE_LIMIT, isPremiumStatus } from "@/lib/free-messages";
import { sendLaunchOfferEmail } from "@/lib/emails/launch-offer";

export const runtime = "nodejs";

// Campagne « 1er mois à 1 € » : envoie l'offre de lancement à tous les comptes
// gratuits ayant épuisé leurs 10 confidences. Déduplication par clé
// d'idempotence Resend (pas de double envoi si relancé).
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  // Mode test : ?test=email → envoie un seul mail à cette adresse et renvoie
  // l'erreur Resend exacte s'il y en a une (debug de délivrabilité).
  const testEmail = new URL(request.url).searchParams.get("test");
  if (testEmail) {
    try {
      const id = await sendLaunchOfferEmail(testEmail, appUrl); // pas de clé d'idempotence → force l'envoi
      return NextResponse.json({ test: testEmail, ok: true, id, from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <bonjour@ancrage.xyz>" });
    } catch (err) {
      return NextResponse.json({ test: testEmail, ok: false, error: err instanceof Error ? err.message : String(err), from: process.env.RESEND_FROM_EMAIL ?? "Ancrage <bonjour@ancrage.xyz>" });
    }
  }

  const { data: profiles } = await admin.from("profiles").select("id, email, plan_status");

  const sent: string[] = [];
  const skipped: { email: string; reason: string }[] = [];

  for (const p of profiles ?? []) {
    if (isPremiumStatus(p.plan_status)) {
      continue; // déjà abonné → on ne relance pas
    }
    if (!p.email) continue;

    const { count } = await admin
      .from("entry_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", p.id)
      .eq("role", "user");

    if ((count ?? 0) < FREE_MESSAGE_LIMIT) {
      skipped.push({ email: p.email, reason: `${count ?? 0}/${FREE_MESSAGE_LIMIT}` });
      continue; // pas encore bloqué
    }

    try {
      // clé d'idempotence datée : un renvoi un autre jour part bien, mais deux
      // exécutions le même jour ne font pas de doublon.
      const today = new Date().toISOString().slice(0, 10);
      await sendLaunchOfferEmail(p.email, appUrl, `launch-offer-1eur-${p.id}-${today}`, p.id);
      sent.push(p.email);
    } catch (err) {
      console.error("[launch-offer] échec:", p.id, err);
    }
  }

  return NextResponse.json({ sent, count: sent.length, skipped_below_limit: skipped.length });
}
