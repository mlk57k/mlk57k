import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { generateCoachReply, type CoachMessage } from "@/lib/anthropic";
import { buildShortTermMemory, buildLongTermMemory, saveExtractedMemories } from "@/lib/memory";
import { FREE_MESSAGE_LIMIT, isPremiumStatus, countUsedConfidences } from "@/lib/free-messages";
import { sendLaunchOfferEmail } from "@/lib/emails/launch-offer";
import { sendPushToUser } from "@/lib/push-server";

// Relance paywall (email + push), une seule fois, quand les confidences
// offertes sont épuisées. Ne bloque jamais la réponse HTTP en cas d'erreur.
async function nudgePaywallOnce(request: Request, userId: string, email: string | null | undefined) {
  try {
    const admin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data: p } = await admin
      .from("profiles")
      .select("paywall_notified_at")
      .eq("id", userId)
      .maybeSingle();
    if (!p || p.paywall_notified_at) return;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    await sendPushToUser(admin, userId, {
      title: "Continue d'écrire, sans limite 🌙",
      body: "Tes 10 confidences offertes sont utilisées. Ton 1er mois à 1 € pour continuer.",
      url: "/paywall",
    });
    if (email) await sendLaunchOfferEmail(email, appUrl, `launch-offer-1eur-${userId}`);
    await admin.from("profiles").update({ paywall_notified_at: new Date().toISOString() }).eq("id", userId);
  } catch (err) {
    console.error("[paywall-nudge] échec:", err);
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "message vide" }, { status: 400 });

  const { data: entry, error: entryError } = await supabase
    .from("journal_entries")
    .select("id, mood_score")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();
  if (entryError || !entry) return NextResponse.json({ error: "introuvable" }, { status: 404 });

  const [{ data: profile }, { data: history }, shortTerm, longTerm] = await Promise.all([
    supabase.from("profiles").select("objectifs, memory_digest, plan_status").eq("id", user.id).single(),
    supabase
      .from("entry_messages")
      .select("role, content")
      .eq("entry_id", params.id)
      .order("created_at", { ascending: true }),
    buildShortTermMemory(supabase, user.id, params.id),
    buildLongTermMemory(supabase, user.id),
  ]);

  // Offre de découverte : 10 confidences offertes, puis paywall
  const premium = isPremiumStatus(profile?.plan_status);
  let remainingConfidences: number | null = null;
  if (!premium) {
    const used = await countUsedConfidences(supabase, user.id);
    if (used >= FREE_MESSAGE_LIMIT) {
      await nudgePaywallOnce(request, user.id, user.email);
      return NextResponse.json(
        { error: "quota_exceeded", remainingConfidences: 0 },
        { status: 402 }
      );
    }
    // ce message va être consommé → restant après envoi
    remainingConfidences = Math.max(0, FREE_MESSAGE_LIMIT - used - 1);
  }

  const { data: userMessage, error: insertError } = await supabase
    .from("entry_messages")
    .insert({ entry_id: params.id, user_id: user.id, role: "user", content })
    .select("id, role, content, created_at")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ userMessage, assistantMessage: null, remainingConfidences });
  }

  try {
    const reply = await generateCoachReply(
      (history ?? []) as CoachMessage[],
      content,
      {
        objectifs: profile?.objectifs ?? null,
        memoryDigest: profile?.memory_digest ?? null,
        shortTerm,
        longTerm,
      },
      process.env.ANTHROPIC_API_KEY
    );

    const { data: assistantMessage, error: assistantError } = await supabase
      .from("entry_messages")
      .insert({ entry_id: params.id, user_id: user.id, role: "assistant", content: reply.message })
      .select("id, role, content, created_at")
      .single();
    if (assistantError) throw new Error(assistantError.message);

    const entryUpdate: { mood_score?: number; content?: string } = {};
    // L'IA estime sur 1-10 ; l'app utilise une échelle 1-5. On ne remplace
    // jamais une humeur choisie manuellement par l'utilisateur.
    if (reply.moodEstimate !== null && entry.mood_score === null) {
      entryUpdate.mood_score = Math.min(5, Math.max(1, Math.round(reply.moodEstimate / 2)));
    }
    if (reply.titre) entryUpdate.content = reply.titre;
    if (Object.keys(entryUpdate).length > 0) {
      await supabase.from("journal_entries").update(entryUpdate).eq("id", params.id);
    }

    // Enrichit la mémoire long terme avec les faits extraits de ce message
    if (reply.memoire.length > 0) {
      await saveExtractedMemories(supabase, user.id, reply.memoire);
    }

    return NextResponse.json({ userMessage, assistantMessage, crisisDetected: reply.crisisDetected, remainingConfidences });
  } catch (err) {
    console.error("[coach] error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ userMessage, assistantMessage: null, error: "coach_unavailable", remainingConfidences });
  }
}
