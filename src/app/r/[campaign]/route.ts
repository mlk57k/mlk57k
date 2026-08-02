import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Lien traçable maison : /r/<campagne>?u=<userId>&to=/paywall
// Enregistre le clic (best-effort) puis redirige. Permet de savoir EXACTEMENT
// qui a cliqué, sans dépendre du tracking Resend.
export async function GET(request: Request, { params }: { params: { campaign: string } }) {
  const url = new URL(request.url);
  const u = url.searchParams.get("u");
  const to = url.searchParams.get("to") ?? "/paywall";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? url.origin;

  if (u && /^[0-9a-fA-F-]{36}$/.test(u)) {
    try {
      const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      await admin.from("email_clicks").insert({ user_id: u, campaign: params.campaign });
    } catch {
      // best-effort : ne jamais bloquer la redirection
    }
  }

  const dest = to.startsWith("/") ? to : "/paywall";
  return NextResponse.redirect(`${appUrl}${dest}`);
}
