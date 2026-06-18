import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { skinAnalysisSchema } from "@/lib/scan-schema";
import { getResend } from "@/lib/resend";
import { scanResultsEmail } from "@/lib/emails/scan-results";

export const runtime = "nodejs";

/**
 * Rattache un scan (réalisé sans compte) à l'utilisateur connecté.
 * Insère une ligne dans `scans` ; la RLS garantit user_id = auth.uid().
 * Envoie ensuite un email de résultats via Resend (fire-and-forget).
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

  // Email de résultats — best-effort, n'impacte pas la réponse
  if (user.email) {
    const resend = getResend();
    if (resend) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const { subject, html } = scanResultsEmail({
        score: skin_score,
        skinAge: skin_age,
        issueCount: issues.length,
        appUrl,
      });
      resend.emails
        .send({
          from: process.env.RESEND_FROM_EMAIL ?? "Glowy <noreply@glowy.app>",
          to: user.email,
          subject,
          html,
        })
        .catch((err) => console.error("[scans/attach] email:", err));
    }
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
