import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function computeDays(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: streaks } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activeStreak = streaks?.find((s) => s.active);
  const currentDays = activeStreak ? computeDays(activeStreak.start_date) : 0;
  const bestDays = streaks
    ? Math.max(...streaks.map((s) => s.days || 0), currentDays)
    : 0;

  // Keep days count in sync
  if (activeStreak && currentDays !== activeStreak.days) {
    await supabase
      .from("streaks")
      .update({ days: currentDays })
      .eq("id", activeStreak.id);
  }

  return NextResponse.json({
    currentDays,
    bestDays,
    activeStreak,
    history: streaks ?? [],
  });
}

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // End any existing active streak first
  const { data: existing } = await supabase
    .from("streaks")
    .select("id")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (existing) {
    await supabase
      .from("streaks")
      .update({ active: false, end_date: new Date().toISOString().split("T")[0] })
      .eq("id", existing.id);
  }

  const { data: newStreak, error } = await supabase
    .from("streaks")
    .insert({
      user_id: user.id,
      start_date: new Date().toISOString().split("T")[0],
      days: 0,
      active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ streak: newStreak });
}
