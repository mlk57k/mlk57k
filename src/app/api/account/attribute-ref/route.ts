import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Attribution influenceur : au premier passage authentifié, on colle le code
// du cookie `ancrage_ref` sur le profil — uniquement s'il n'en a pas déjà un
// (premier influenceur crédité, jamais écrasé).
export async function POST() {
  const ref = cookies().get("ancrage_ref")?.value;
  if (!ref) return NextResponse.json({ ok: true, attributed: false });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  await supabase
    .from("profiles")
    .update({ referred_by: ref })
    .eq("id", user.id)
    .is("referred_by", null);

  return NextResponse.json({ ok: true, attributed: true });
}
