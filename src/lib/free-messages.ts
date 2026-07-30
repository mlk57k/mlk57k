import type { SupabaseClient } from "@supabase/supabase-js";

// Offre de découverte : 10 "confidences" (messages au coach) offertes,
// puis paywall. Le compteur est global au compte (à vie, pas par semaine).
export const FREE_MESSAGE_LIMIT = 10;

export function isPremiumStatus(planStatus: string | null | undefined): boolean {
  return planStatus === "active" || planStatus === "trialing";
}

/** Nombre de confidences déjà utilisées (messages envoyés par l'utilisateur au coach). */
export async function countUsedConfidences(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from("entry_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "user");
  return count ?? 0;
}

/** Confidences restantes (0 si épuisées, Infinity si abonné). */
export async function remainingConfidences(
  supabase: SupabaseClient,
  userId: string,
  planStatus: string | null | undefined
): Promise<number> {
  if (isPremiumStatus(planStatus)) return Infinity;
  const used = await countUsedConfidences(supabase, userId);
  return Math.max(0, FREE_MESSAGE_LIMIT - used);
}
