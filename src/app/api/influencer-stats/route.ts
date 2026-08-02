import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { FREE_MESSAGE_LIMIT, isPremiumStatus } from "@/lib/free-messages";

export const runtime = "nodejs";

// Token privé déterministe : HMAC(code, CRON_SECRET). Seul le propriétaire
// (qui a CRON_SECRET) peut générer un lien valide ; l'influenceuse ne voit
// que SES chiffres, jamais ceux des autres ni de données personnelles.
function tokenFor(code: string): string {
  return crypto
    .createHmac("sha256", process.env.CRON_SECRET ?? "")
    .update(code)
    .digest("hex")
    .slice(0, 32);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get("code") ?? "").trim().toLowerCase();
  const token = searchParams.get("token") ?? "";

  if (!code || !process.env.CRON_SECRET) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const expected = tokenFor(code);
  const ok =
    token.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  if (!ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  }

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, plan_status")
    .eq("referred_by", code);

  let signups = 0;
  let paid = 0;
  let paywall = 0;
  for (const p of profiles ?? []) {
    signups++;
    if (isPremiumStatus(p.plan_status)) paid++;
    const { count } = await admin
      .from("entry_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", p.id)
      .eq("role", "user");
    if ((count ?? 0) >= FREE_MESSAGE_LIMIT) paywall++;
  }

  return NextResponse.json({ code, signups, paywall, paid });
}
