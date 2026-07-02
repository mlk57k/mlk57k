import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendPushToUser } from "@/lib/push-server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const sent = await sendPushToUser(admin, user.id, {
    title: "Ancrage",
    body: "Les notifications fonctionnent. À ce soir ✨",
    url: "/journal",
  });

  if (sent === 0) {
    return NextResponse.json({ error: "aucun appareil abonné" }, { status: 400 });
  }
  return NextResponse.json({ sent });
}
