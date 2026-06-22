import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await request.json();
  const {
    addictionType,
    frequency,
    durationLabel,
    triggers,
    motivationScore,
    motivation,
    severity,
  } = body;

  const { error } = await supabase
    .from("profiles")
    .update({
      addiction_type: addictionType,
      frequency,
      duration_label: durationLabel,
      triggers,
      motivation: `Score: ${motivationScore}/10. ${motivation}`,
      severity,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create initial streak
  await supabase.from("streaks").insert({
    user_id: user.id,
    start_date: new Date().toISOString().split("T")[0],
    days: 0,
    active: true,
  });

  return NextResponse.json({ success: true });
}
