"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Entry {
  id: string;
  created_at: string;
  mood_score: number | null;
}

const MOOD_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  5: { bg: "#8FA086", text: "#fff", label: "Serein" },
  4: { bg: "#CDA45C", text: "#fff", label: "Léger" },
  3: { bg: "#BD6E4C", text: "#fff", label: "Mêlé" },
  2: { bg: "#D3917C", text: "#fff", label: "Sensible" },
  1: { bg: "#7C8AA0", text: "#fff", label: "Lourd" },
};

export default function EntryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth"); return; }

      const [{ data: entryData }, { data: msgData }] = await Promise.all([
        supabase
          .from("journal_entries")
          .select("id, created_at, mood_score")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("entry_messages")
          .select("id, role, content, created_at")
          .eq("entry_id", params.id)
          .order("created_at", { ascending: true }),
      ]);

      if (!entryData) { router.replace("/journal/historique"); return; }
      setEntry(entryData);
      setMessages(msgData ?? []);
      setLoading(false);
    })();
  }, [params?.id, router]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      weekday: "long", day: "numeric", month: "long",
    });
  }

  const mood = entry?.mood_score ? MOOD_COLORS[entry.mood_score] : null;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/journal/historique" className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="text-center">
            {entry && (
              <>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 leading-none">
                  {formatDate(entry.created_at)}
                </p>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">Entrée du soir</p>
              </>
            )}
          </div>
          <Link href="/journal"><AppLogo size="sm" /></Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-6">
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn("h-20 rounded-2xl bg-white border border-cream-200 animate-pulse", i % 2 === 0 && "ml-8")} />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {mood && (
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: mood.bg }} />
                <span className="text-sm font-medium text-stone-600">{mood.label}</span>
              </div>
            )}

            <div className="flex flex-col gap-4 mb-6">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "assistant" && (
                    <div className="flex items-start gap-2.5 max-w-[88%]">
                      <div className="w-7 h-7 rounded-lg bg-coral-400 flex-none flex items-center justify-center mt-0.5">
                        <span className="font-display text-white text-xs font-semibold">A</span>
                      </div>
                      <div className="bg-cream-50 border border-coral-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-stone-700">
                        {m.content}
                      </div>
                    </div>
                  )}
                  {m.role === "user" && (
                    <div className="max-w-[85%] bg-coral-400 text-white rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
                      {m.content}
                    </div>
                  )}
                </div>
              ))}

              {messages.length === 0 && (
                <p className="text-stone-400 text-sm text-center py-8">Cette entrée ne contient pas encore de messages.</p>
              )}
            </div>

            <div className="flex justify-center">
              <Link
                href={`/journal?entree=${entry?.id ?? ""}`}
                className="text-sm text-coral-500 font-medium hover:underline"
              >
                Continuer à écrire →
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
