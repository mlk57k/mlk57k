import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Archive current active streak
  const { data: activeStreak } = await supabase
    .from("streaks")
    .select("id, start_date")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();

  if (activeStreak) {
    const days = Math.floor(
      (new Date(today).getTime() - new Date(activeStreak.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    await supabase
      .from("streaks")
      .update({ active: false, end_date: today, days })
      .eq("id", activeStreak.id);
  }

  // Create new streak starting from today
  const { data: newStreak } = await supabase
    .from("streaks")
    .insert({
      user_id: user.id,
      start_date: today,
      days: 0,
      active: true,
    })
    .select()
    .single();

  return NextResponse.json({ success: true, newStreak });
}
