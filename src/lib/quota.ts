import type { SupabaseClient } from "@supabase/supabase-js";

const FREE_ENTRIES_PER_WEEK = 3;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface QuotaProfile {
  plan_status: string;
  free_entries_used: number;
  free_entries_reset_at: string;
}

export interface QuotaResult {
  allowed: boolean;
  remaining: number;
}

export async function consumeFreeEntry(
  supabase: SupabaseClient,
  userId: string,
  profile: QuotaProfile
): Promise<QuotaResult> {
  if (profile.plan_status === "active" || profile.plan_status === "trialing") {
    return { allowed: true, remaining: Infinity };
  }

  let used = profile.free_entries_used;
  let resetAt = new Date(profile.free_entries_reset_at);

  if (Date.now() - resetAt.getTime() > WEEK_MS) {
    used = 0;
    resetAt = new Date();
  }

  if (used >= FREE_ENTRIES_PER_WEEK) {
    await supabase.from("profiles").update({ free_entries_reset_at: resetAt.toISOString() }).eq("id", userId);
    return { allowed: false, remaining: 0 };
  }

  used += 1;
  await supabase
    .from("profiles")
    .update({ free_entries_used: used, free_entries_reset_at: resetAt.toISOString() })
    .eq("id", userId);

  return { allowed: true, remaining: FREE_ENTRIES_PER_WEEK - used };
}
