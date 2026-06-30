import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateWeeklySummary } from "@/lib/anthropic";
import { sendWeeklySummaryEmail } from "@/lib/emails/weekly-summary";

export const runtime = "nodejs";

function getAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/**
 * Exécuté une fois par semaine. Pas de bilan envoyé pour les profils sans
 * aucune entrée écrite dans les 7 derniers jours — on ne relance jamais
 * quelqu'un sur une semaine vide.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Anthropic non configuré." }, { status: 503 });
  }

  const admin = getAdminClient();
  const weekEnd = new Date();
  const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekStartDate = weekStart.toISOString().slice(0, 10);
  const weekEndDate = weekEnd.toISOString().slice(0, 10);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const { data: profiles } = await admin.from("profiles").select("id, email");
  let processed = 0;

  for (const profile of profiles ?? []) {
    const { data: entries } = await admin
      .from("journal_entries")
      .select("content, mood_score, created_at")
      .eq("user_id", profile.id)
      .gte("created_at", weekStart.toISOString())
      .lte("created_at", weekEnd.toISOString())
      .order("created_at", { ascending: true });

    if (!entries || entries.length === 0) continue;

    try {
      const summary = await generateWeeklySummary(
        entries.map((e) => ({ content: e.content, moodScore: e.mood_score, createdAt: e.created_at })),
        process.env.ANTHROPIC_API_KEY!
      );

      const moodTrend = entries
        .filter((e) => e.mood_score !== null)
        .map((e) => ({ date: e.created_at, mood: e.mood_score }));

      const { data: inserted, error: upsertError } = await admin
        .from("weekly_summaries")
        .upsert(
          { user_id: profile.id, week_start: weekStartDate, week_end: weekEndDate, summary, mood_trend: moodTrend },
          { onConflict: "user_id,week_start" }
        )
        .select("emailed_at")
        .single();

      if (upsertError) {
        console.error("[cron/weekly-summary] insertion échouée:", profile.id, upsertError);
        continue;
      }

      if (!inserted?.emailed_at) {
        const weekLabel = `${weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
        await sendWeeklySummaryEmail({ to: profile.email, weekLabel, summary, appUrl });
        await admin
          .from("weekly_summaries")
          .update({ emailed_at: new Date().toISOString() })
          .eq("user_id", profile.id)
          .eq("week_start", weekStartDate);
      }

      processed++;
    } catch (err) {
      console.error("[cron/weekly-summary] erreur:", profile.id, err);
    }
  }

  return NextResponse.json({ processed });
}
