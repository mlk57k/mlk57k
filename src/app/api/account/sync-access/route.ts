import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isComped } from "@/lib/comp";

// Appelé juste après la connexion : accorde l'accès complet aux comptes de
// la liste blanche (invités / testeurs), avant même qu'ils utilisent l'app.
export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!isComped(user.email)) return NextResponse.json({ comped: false });

  const admin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // upsert au cas où le profil n'existe pas encore (trigger pas déclenché)
  await admin
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email ?? "", plan_status: "active" },
      { onConflict: "id" }
    );

  return NextResponse.json({ comped: true });
}
