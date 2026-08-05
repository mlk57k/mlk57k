"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mic, Send, Square, History, BarChart3, Settings, Flame, Sparkles, Smartphone, X, Wind } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { computeStreaks } from "@/lib/streak";
import { getDailyQuestion } from "@/lib/prompts";
import { extractPrenom } from "@/lib/profile";
import { FREE_MESSAGE_LIMIT } from "@/lib/free-messages";

const CHECKIN_MOODS = [
  { score: 5, color: "#8FA086", label: "Serein" },
  { score: 4, color: "#CDA45C", label: "Léger" },
  { score: 3, color: "#BD6E4C", label: "Mêlé" },
  { score: 2, color: "#D3917C", label: "Sensible" },
  { score: 1, color: "#7C8AA0", label: "Lourd" },
];

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

const CRISIS_HOTLINE = "3114";

function JournalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entryId, setEntryId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [streak, setStreak] = useState(0);
  const [prenom, setPrenom] = useState<string | null>(null);
  const [checkinMood, setCheckinMood] = useState<number | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  // Confidences offertes restantes (null = abonné, illimité)
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    const dismissed = localStorage.getItem("ancrage-install-dismissed") === "1";
    setShowInstallBanner(!standalone && !dismissed);
  }, []);

  function dismissInstallBanner() {
    localStorage.setItem("ancrage-install-dismissed", "1");
    setShowInstallBanner(false);
  }
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const resumeId = searchParams.get("entree");

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth?next=/journal"); return; }

      // Série de jours consécutifs + prénom + confidences restantes
      const [{ data: entryDates }, { data: profileData }, { count: usedConfidences }] = await Promise.all([
        supabase.from("journal_entries").select("created_at").eq("user_id", user.id),
        supabase.from("profiles").select("objectifs, plan_status").eq("id", user.id).single(),
        supabase
          .from("entry_messages")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("role", "user"),
      ]);
      if (entryDates) setStreak(computeStreaks(entryDates.map((e) => e.created_at)).current);
      setPrenom(extractPrenom(profileData?.objectifs));

      const premium = profileData?.plan_status === "active" || profileData?.plan_status === "trialing";
      setRemaining(premium ? null : Math.max(0, FREE_MESSAGE_LIMIT - (usedConfidences ?? 0)));

      // Reprendre une entrée existante (lien "Continuer à écrire")
      if (resumeId) {
        const { data: msgData } = await supabase
          .from("entry_messages")
          .select("id, role, content, created_at")
          .eq("entry_id", resumeId)
          .order("created_at", { ascending: true });
        if (msgData && msgData.length > 0) {
          setEntryId(resumeId);
          setMessages(msgData as Message[]);
        }
      }
    })();
  }, [router, resumeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function ensureEntry(): Promise<string | null> {
    if (entryId) return entryId;
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "", mood_score: checkinMood }),
    });
    if (res.status === 402) {
      router.push("/paywall");
      return null;
    }
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erreur serveur (${res.status})`);
    }
    const data = await res.json();
    if (!data.entry?.id) throw new Error("Réponse invalide du serveur.");
    setEntryId(data.entry.id);
    return data.entry.id;
  }

  async function sendMessage(content: string) {
    if (!content.trim() || sending) return;
    setSending(true);
    setSendError(null);

    try {
      const id = await ensureEntry();
      if (!id) return;

      const optimistic: Message = {
        id: `local-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, optimistic]);
      setText("");
      // Petit retour tactile sur mobile — l'envoi devient un geste satisfaisant
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);

      const res = await fetch(`/api/entries/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      // Confidences offertes épuisées → paywall
      if (res.status === 402) {
        setMessages((m) => m.filter((msg) => msg.id !== optimistic.id));
        setText(content);
        router.push("/paywall");
        return;
      }

      const data = await res.json();
      if (data.assistantMessage) {
        setMessages((m) => [...m, data.assistantMessage]);
      }
      if (typeof data.remainingConfidences === "number") {
        setRemaining(data.remainingConfidences);
      }
      if (data.crisisDetected) setCrisisDetected(true);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setSending(false);
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", blob, "note.webm");
          const res = await fetch("/api/transcribe", { method: "POST", body: formData });
          const data = await res.json();
          if (data.text) setText((t) => (t ? `${t} ${data.text}` : data.text));
        } finally {
          setTranscribing(false);
        }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch {
      // micro refusé ou indisponible
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  const bienvenue = searchParams.get("bienvenue") === "1";

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/"><AppLogo size="sm" /></Link>
          <nav className="flex items-center gap-1">
            {streak > 0 && (
              <span
                className="flex items-center gap-1 mr-1 px-2.5 py-1 rounded-full bg-coral-50 border border-coral-100 text-coral-600 text-xs font-semibold"
                title={`${streak} jour${streak > 1 ? "s" : ""} d'affilée`}
              >
                <Flame className="h-3.5 w-3.5" />
                {streak}
              </span>
            )}
            <Button asChild size="icon" variant="ghost" aria-label="Pause respiration">
              <Link href="/respiration"><Wind className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="icon" variant="ghost" aria-label="Historique">
              <Link href="/journal/historique"><History className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="icon" variant="ghost" aria-label="Bilan">
              <Link href="/bilan"><BarChart3 className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="icon" variant="ghost" aria-label="Paramètres">
              <Link href="/parametres"><Settings className="h-4 w-4" /></Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col mx-auto w-full max-w-2xl px-4 sm:px-6 py-6">
        {bienvenue && (
          <div className="mb-4 rounded-2xl bg-coral-50 border border-coral-200 px-4 py-3 text-sm text-coral-700">
            Bienvenue dans l&apos;illimité ! Ton accès est actif — écris autant que tu veux. 💛
          </div>
        )}

        {showInstallBanner && (
          <div className="mb-4 rounded-2xl bg-white border border-cream-200 px-4 py-3 flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-coral-400 flex-none" />
            <Link href="/installer" className="flex-1 text-sm text-stone-700 leading-snug">
              <span className="font-semibold">Installe Ancrage sur ton écran d&apos;accueil</span>
              <span className="text-stone-400"> — plein écran, notifications, à un tap de toi.</span>
            </Link>
            <button
              type="button"
              onClick={dismissInstallBanner}
              aria-label="Masquer"
              className="text-stone-300 hover:text-stone-500 flex-none p-1 -m-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {remaining !== null && (
          <Link
            href={remaining === 0 ? "/paywall" : "#"}
            onClick={(e) => { if (remaining !== 0) e.preventDefault(); }}
            className="mb-4 rounded-2xl bg-cream-100 border border-cream-200 px-4 py-2.5 flex items-center justify-center gap-1.5 text-sm text-stone-500"
          >
            <Sparkles className="h-3.5 w-3.5 text-coral-400 flex-none" />
            {remaining > 0 ? (
              <span>
                Il te reste <span className="font-semibold text-coral-600">{remaining} confidence{remaining > 1 ? "s" : ""}</span> offerte{remaining > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="font-semibold text-coral-600">Tes confidences offertes sont terminées — passe à l&apos;illimité →</span>
            )}
          </Link>
        )}

        {sendError && (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {sendError}
          </div>
        )}

        {crisisDetected && (
          <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
            Si tu traverses un moment difficile, le {CRISIS_HOTLINE} (numéro national de prévention
            du suicide) est disponible jour et nuit. En cas d&apos;urgence : le 15 (SAMU) ou le 112.
          </div>
        )}

        {messages.length === 0 && !sending && (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-stone-400 py-16">
            <p className="font-display text-xl text-stone-600 mb-2">
              {prenom ? `${prenom}, comment s'est passée ta journée ?` : "Comment s'est passée ta journée ?"}
            </p>
            <p className="text-sm mb-6">Écris ou enregistre une note vocale, le coach te répond.</p>

            {/* Check-in humeur */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
                Là, maintenant, tu te sens…
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {CHECKIN_MOODS.map(({ score, color, label }) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setCheckinMood(checkinMood === score ? null : score)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm font-medium transition-all",
                      checkinMood === score
                        ? "border-coral-300 bg-coral-50 text-stone-900"
                        : "border-cream-200 bg-white text-stone-600 hover:border-coral-100"
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const question = getDailyQuestion();
                setMessages([{
                  id: `question-${Date.now()}`,
                  role: "assistant",
                  content: question,
                  created_at: new Date().toISOString(),
                }]);
              }}
              className="group max-w-sm w-full text-left bg-white border border-cream-200 hover:border-coral-200 rounded-2xl px-5 py-4 transition-colors shadow-sm"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-coral-500 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Question du jour
              </span>
              <span className="block text-sm text-stone-700 leading-relaxed">{getDailyQuestion()}</span>
              <span className="block mt-2.5 text-xs font-medium text-coral-400 group-hover:underline">
                Y répondre →
              </span>
            </button>
          </div>
        )}

        <div className="flex-1 space-y-4 mb-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line animate-message-in",
                  m.role === "user"
                    ? "origin-bottom-right bg-coral-400 text-white shadow-[0_6px_18px_-6px_rgba(196,82,58,0.55)]"
                    : "origin-bottom-left bg-white border border-cream-200 text-stone-700 shadow-sm"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start animate-message-in origin-bottom-left">
              <div className="flex items-center gap-1.5 rounded-2xl px-4 py-3.5 bg-white border border-cream-200">
                <span className="w-2 h-2 rounded-full bg-coral-300 animate-dot-bounce" />
                <span className="w-2 h-2 rounded-full bg-coral-300 animate-dot-bounce [animation-delay:0.18s]" />
                <span className="w-2 h-2 rounded-full bg-coral-300 animate-dot-bounce [animation-delay:0.36s]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(text);
          }}
          className="sticky bottom-4 flex items-end gap-2 rounded-2xl border border-cream-200 bg-white p-2 shadow-lift"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(text);
              }
            }}
            placeholder={transcribing ? "Transcription en cours…" : "Écris ici…"}
            rows={1}
            disabled={transcribing}
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none max-h-32"
          />
          <Button
            type="button"
            size="icon"
            variant={recording ? "default" : "ghost"}
            onClick={recording ? stopRecording : startRecording}
            aria-label={recording ? "Arrêter l'enregistrement" : "Enregistrer une note vocale"}
          >
            {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={!text.trim() || sending}
            className="transition-all duration-200 active:scale-90 disabled:scale-90 disabled:opacity-40 enabled:shadow-[0_4px_14px_-4px_rgba(196,82,58,0.6)]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </main>
    </div>
  );
}

function JournalSplash() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="animate-pulse">
        <AppLogo size="md" />
      </div>
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={<JournalSplash />}>
      <JournalContent />
    </Suspense>
  );
}
