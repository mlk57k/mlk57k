import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { skinAnalysisSchema } from "@/lib/scan-schema";

export const runtime = "nodejs";

/**
 * Rattache un scan (réalisé sans compte) à l'utilisateur connecté.
 * Insère une ligne dans `scans` ; la RLS garantit user_id = auth.uid().
 */
export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = skinAnalysisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données de scan invalides." }, { status: 400 });
  }

  const { skin_score, skin_age, issues, routine } = parsed.data;

  const { data, error } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      skin_score,
      skin_age,
      issues,
      routine,
      unlocked: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[scans/attach] erreur:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le scan." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
