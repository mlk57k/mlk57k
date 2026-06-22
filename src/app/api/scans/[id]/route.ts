import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  const [scanResult, profileResult] = await Promise.all([
    supabase
      .from("scans")
      .select("id, skin_score, skin_age, issues, routine, unlocked, created_at")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("profiles")
      .select("lifetime_access")
      .eq("id", user.id)
      .single(),
  ]);

  if (scanResult.error || !scanResult.data) {
    return NextResponse.json({ error: "Scan introuvable." }, { status: 404 });
  }

  const data = {
    ...scanResult.data,
    unlocked: scanResult.data.unlocked || (profileResult.data?.lifetime_access ?? false),
  };

  return NextResponse.json(data);
}
