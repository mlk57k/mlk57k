"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Flame, Trophy, BookOpen } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { computeStreaks, type StreakStats } from "@/lib/streak";

interface WeeklySummary {
  id: string;
  week_start: string;
  summary_text: string;
  mood_trend: number[];
}

interface MoodEntry {
  created_at: string;
  mood_score: number;
}

const MOOD_COLORS: Record<number, string> = {
  10: "#8FA086", 9: "#8FA086",
  8: "#CDA45C",  7: "#CDA45C",
  6: "#BD6E4C",  5: "#BD6E4C",
  4: "#D3917C",  3: "#D3917C",
  2: "#7C8AA0",  1: "#7C8AA0",
};
const MOOD_LABELS: Record<string, { color: string; label: string }> = {
  high:    { color: "#8FA086", label: "Serein" },
  good:    { color: "#CDA45C", label: "Léger" },
  neutral: { color: "#BD6E4C", label: "Mêlé" },
  low:     { color: "#D3917C", label: "Sensible" },
  hard:    { color: "#7C8AA0", label: "Lourd" },
};

function MoodBar({ score, date }: { score: number; date: string }) {
  const heightPct = (score / 5) * 100;
  const day = new Date(date).toLocaleDateString("fr-FR", { weekday: "short" });
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="w-full flex flex-col justify-end" style={{ height: 64 }}>
        <div
          className="w-full rounded-t-lg rounded-b-sm transition-all"
          style={{
            height: `${heightPct}%`,
            background: MOOD_COLORS[score] ?? "#E7DDCB",
          }}
        />
      </div>
      <span className="text-xs text-stone-400 font-medium">{day}</span>
    </div>
  );
}

function weekLabel(dateStr: string) {
  const d = new Date(dateStr);
  const end = new Date(d);
  end.setDate(d.getDate() + 6);
  return `${d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
}

export default function BilanPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<WeeklySummary[]>([]);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [streaks, setStreaks] = useState<StreakStats>({ current: 0, best: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth?next=/bilan"); return; }

      const [{ data: sums }, { data: moods }, { data: allDates }] = await Promise.all([
        supabase
          .from("weekly_summaries")
          .select("id, week_start, summary_text, mood_trend")
          .eq("user_id", user.id)
          .order("week_start", { ascending: false })
          .limit(8),
        supabase
          .from("journal_entries")
          .select("created_at, mood_score")
          .eq("user_id", user.id)
          .not("mood_score", "is", null)
          .order("created_at", { ascending: false })
          .limit(14),
        supabase
          .from("journal_entries")
          .select("created_at")
          .eq("user_id", user.id),
      ]);

      setSummaries(sums ?? []);
      setRecentMoods((moods ?? []).filter((m) => m.mood_score !== null).reverse() as MoodEntry[]);
      if (allDates) setStreaks(computeStreaks(allDates.map((e) => e.created_at)));
      setLoading(false);
    })();
  }, [router]);

  const lastSevenMoods = recentMoods.slice(-7);

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/journal"><AppLogo size="sm" /></Link>
          <Link href="/journal" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Mon journal
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-2">Tableau de bord</p>
          <h1 className="font-display text-3xl font-semibold text-stone-900">Ton bilan</h1>
        </div>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-cream-200 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Série & stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center">
                <Flame className="h-5 w-5 mx-auto mb-1.5 text-coral-400" />
                <p className="font-display text-2xl font-semibold text-stone-900 leading-none">{streaks.current}</p>
                <p className="text-[11px] text-stone-400 mt-1.5 leading-tight">jour{streaks.current > 1 ? "s" : ""} d&apos;affilée</p>
              </div>
              <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center">
                <Trophy className="h-5 w-5 mx-auto mb-1.5 text-champagne-400" />
                <p className="font-display text-2xl font-semibold text-stone-900 leading-none">{streaks.best}</p>
                <p className="text-[11px] text-stone-400 mt-1.5 leading-tight">record</p>
              </div>
              <div className="bg-white border border-cream-200 rounded-2xl p-4 text-center">
                <BookOpen className="h-5 w-5 mx-auto mb-1.5 text-sage" />
                <p className="font-display text-2xl font-semibold text-stone-900 leading-none">{streaks.total}</p>
                <p className="text-[11px] text-stone-400 mt-1.5 leading-tight">entrée{streaks.total > 1 ? "s" : ""}</p>
              </div>
            </div>

            {/* Humeurs 7 derniers jours */}
            <div className="bg-white border border-cream-200 rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-5">Tes humeurs cette semaine</p>
              {lastSevenMoods.length > 0 ? (
                <>
                  <div className="flex items-end gap-2">
                    {lastSevenMoods.map((m, i) => (
                      <MoodBar key={i} score={m.mood_score} date={m.created_at} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-5">
                    {Object.entries(MOOD_LABELS).reverse().map(([key, { color, label }]) => (
                      <span key={key} className="flex items-center gap-1.5 text-xs text-stone-500">
                        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                        {label}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-stone-400 text-sm py-4 text-center">
                  Sélectionne une humeur dans ton journal pour la voir ici.
                </p>
              )}
            </div>

            {/* Bilans hebdomadaires */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Bilans hebdomadaires</p>
              {summaries.length === 0 ? (
                <div className="bg-white border border-cream-200 rounded-2xl p-6 text-center">
                  <p className="text-stone-400 text-sm">
                    Ton premier bilan hebdomadaire apparaîtra ici dès que tu auras journalisé plusieurs soirs.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {summaries.map((s) => (
                    <div key={s.id} className="bg-white border border-cream-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-coral-500">
                          {weekLabel(s.week_start)}
                        </p>
                        {s.mood_trend?.length > 0 && (
                          <div className="flex items-center gap-1">
                            {s.mood_trend.map((score, i) => (
                              <span
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ background: MOOD_COLORS[score] ?? "#E7DDCB" }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-stone-700 text-sm leading-relaxed">{s.summary_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
