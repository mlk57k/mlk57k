"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";

interface Entry {
  id: string;
  created_at: string;
  content: string;
  mood_score: number | null;
}

const MOOD_COLORS: Record<number, string> = {
  10: "#8FA086", 9: "#8FA086",
  8: "#CDA45C",  7: "#CDA45C",
  6: "#BD6E4C",  5: "#BD6E4C",
  4: "#D3917C",  3: "#D3917C",
  2: "#7C8AA0",  1: "#7C8AA0",
};

function moodColor(score: number | null) {
  if (!score) return "#E7DDCB";
  return MOOD_COLORS[score] ?? "#BD6E4C";
}

function groupByWeek(entries: Entry[]) {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  startOfThisWeek.setHours(0, 0, 0, 0);

  const thisWeek: Entry[] = [];
  const lastWeek: Entry[] = [];
  const older: Entry[] = [];

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  for (const e of entries) {
    const d = new Date(e.created_at);
    if (d >= startOfThisWeek) thisWeek.push(e);
    else if (d >= startOfLastWeek) lastWeek.push(e);
    else older.push(e);
  }

  return { thisWeek, lastWeek, older };
}

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function HistoriquePage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth?next=/journal/historique"); return; }

      const { data } = await supabase
        .from("journal_entries")
        .select("id, created_at, content, mood_score")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(60);

      setEntries(data ?? []);
      setLoading(false);
    })();
  }, [router]);

  const { thisWeek, lastWeek, older } = groupByWeek(entries);

  function EntryCard({ entry }: { entry: Entry }) {
    return (
      <Link href={`/journal/${entry.id}`}>
        <div className="bg-white border border-cream-200 rounded-2xl px-5 py-4 hover:border-coral-100 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: moodColor(entry.mood_score) }} />
              <span className="font-semibold text-stone-900 text-sm">{formatDay(entry.created_at)}</span>
            </div>
            <span className="text-xs text-stone-400">{formatTime(entry.created_at)}</span>
          </div>
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">{entry.content || "Entrée vide"}</p>
          {entry.content && (
            <span className="inline-block mt-2.5 text-xs font-semibold text-stone-500 bg-cream-100 border border-cream-200 px-2.5 py-1 rounded-lg">
              Texte
            </span>
          )}
        </div>
      </Link>
    );
  }

  function Section({ label, items }: { label: string; items: Entry[] }) {
    if (!items.length) return null;
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">{label}</p>
        <div className="flex flex-col gap-3">
          {items.map((e) => <EntryCard key={e.id} entry={e} />)}
        </div>
      </div>
    );
  }

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

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-2">Ton carnet</p>
          <h1 className="font-display text-3xl font-semibold text-stone-900">Tes soirs</h1>
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-cream-200 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="font-display text-xl text-stone-600 mb-2">Ton carnet est vide</p>
            <p className="text-sm mb-6">Ta première entrée sera affichée ici.</p>
            <Link href="/journal" className="text-sm text-coral-500 font-medium hover:underline">
              Écrire maintenant →
            </Link>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="flex flex-col gap-8">
            <Section label="Cette semaine" items={thisWeek} />
            <Section label="Semaine dernière" items={lastWeek} />
            <Section label="Plus tôt" items={older} />
          </div>
        )}
      </main>
    </div>
  );
}
