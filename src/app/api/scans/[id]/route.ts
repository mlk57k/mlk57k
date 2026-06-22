import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("scans")
    .select("id, skin_score, skin_age, issues, routine, unlocked, created_at")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Scan introuvable." }, { status: 404 });
  }

  // Si le scan n'est pas encore débloqué, vérifier l'accès à vie (code promo)
  if (!data.unlocked && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await admin
      .from("profiles")
      .select("lifetime_access")
      .eq("id", user.id)
      .single();
    if (profile?.lifetime_access) {
      return NextResponse.json({ ...data, unlocked: true });
    }
  }

  return NextResponse.json(data);
}
