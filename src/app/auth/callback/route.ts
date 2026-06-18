import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback OAuth : échange le code contre une session, puis renvoie vers
 * /auth/complete (qui rattachera un éventuel scan temporaire).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/checkout";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(
        `${origin}/auth/complete?next=${encodeURIComponent(next)}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=oauth`);
}
