import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generatePersonalizedPlan } from "@/lib/coaching-ai";
import type { UserProfile } from "@/lib/coaching-ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ plan: plan ?? null });
}

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("addiction_type, severity, triggers, motivation, frequency, duration_label")
    .eq("id", user.id)
    .single();

  if (!profile?.addiction_type) {
    return NextResponse.json({ error: "Profil incomplet." }, { status: 400 });
  }

  const userProfile: UserProfile = {
    addictionType: profile.addiction_type,
    severity: profile.severity ?? "moderate",
    triggers: profile.triggers ?? [],
    motivation: profile.motivation ?? "",
    frequency: profile.frequency ?? "",
    durationLabel: profile.duration_label ?? "",
  };

  const planContent = await generatePersonalizedPlan(userProfile);

  // Deactivate old plans
  await supabase
    .from("plans")
    .update({ active: false })
    .eq("user_id", user.id)
    .eq("active", true);

  const { data: newPlan, error } = await supabase
    .from("plans")
    .insert({
      user_id: user.id,
      content: planContent,
      active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: newPlan });
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { planId, content } = await request.json();

  if (!planId || !content) {
    return NextResponse.json({ error: "planId et content requis." }, { status: 400 });
  }

  const { error } = await supabase
    .from("plans")
    .update({ content })
    .eq("id", planId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
