import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendDailyRecapEmail } from "@/lib/emails/daily-recap";

export const runtime = "nodejs";

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// Email récap quotidien envoyé à l'admin : nouveaux inscrits + entrées du jour.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const admin = getAdminClient();
  const adminEmail = process.env.ADMIN_EMAIL ?? "badnxko18@gmail.com";

  // Fenêtre "aujourd'hui" : dernières 24h (le cron tourne une fois par jour)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: newProfiles },
    { count: totalSignups },
    { count: newEntries },
    { count: totalEntries },
  ] = await Promise.all([
    admin.from("profiles").select("email, created_at").gte("created_at", since).order("created_at", { ascending: true }),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("journal_entries").select("id", { count: "exact", head: true }).gte("created_at", since),
    admin.from("journal_entries").select("id", { count: "exact", head: true }),
  ]);

  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  await sendDailyRecapEmail({
    to: adminEmail,
    dateLabel,
    newSignups: newProfiles?.length ?? 0,
    newEntries: newEntries ?? 0,
    totalSignups: totalSignups ?? 0,
    totalEntries: totalEntries ?? 0,
    signupEmails: (newProfiles ?? []).map((p) => p.email).filter(Boolean),
  });

  return NextResponse.json({
    sent: true,
    newSignups: newProfiles?.length ?? 0,
    newEntries: newEntries ?? 0,
  });
}
