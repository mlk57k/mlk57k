"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mic, Send, Square, History, BarChart3, Settings } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [quotaError, setQuotaError] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);
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
      body: JSON.stringify({ content: "" }),
    });
    if (res.status === 402) {
      setQuotaError(true);
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
    setQuotaError(false);
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

      const res = await fetch(`/api/entries/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (data.assistantMessage) {
        setMessages((m) => [...m, data.assistantMessage]);
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
            Bienvenue dans Ancrage. Ton essai gratuit a commencé.
          </div>
        )}

        {quotaError && (
          <div className="mb-4 rounded-2xl bg-stone-900 text-white px-5 py-4 text-sm">
            <p className="font-semibold mb-1">Tu as utilisé tes 3 entrées gratuites cette semaine.</p>
            <p className="text-stone-300 mb-3">Passe à l&apos;illimité pour continuer à écrire dès maintenant.</p>
            <Button asChild size="sm">
              <Link href="/abonnement">Voir les formules</Link>
            </Button>
          </div>
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
            <p className="font-display text-xl text-stone-600 mb-2">Comment s&apos;est passée ta journée ?</p>
            <p className="text-sm">Écris ou enregistre une note vocale, le coach te répond.</p>
          </div>
        )}

        <div className="flex-1 space-y-4 mb-4">
          {messages.map((m) => (
            <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                  m.role === "user" ? "bg-coral-400 text-white" : "bg-white border border-cream-200 text-stone-700"
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-white border border-cream-200 text-stone-400 text-sm">…</div>
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
          <Button type="submit" size="icon" disabled={!text.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </main>
    </div>
  );
}

export default function JournalPage() {
  return (
    <Suspense fallback={null}>
      <JournalContent />
    </Suspense>
  );
}
