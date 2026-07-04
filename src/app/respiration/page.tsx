"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Wind } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SESSION_SECONDS = 180; // 3 minutes de cohérence cardiaque
const PHASE_SECONDS = 5;

export default function RespirationPage() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"inspire" | "expire">("inspire");
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth?next=/respiration"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("plan_status")
        .eq("id", user.id)
        .single();
      setIsPremium(data?.plan_status === "active" || data?.plan_status === "trialing");
    })();
  }, [router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (phaseRef.current) clearInterval(phaseRef.current);
    };
  }, []);

  function start() {
    setRunning(true);
    setSecondsLeft(SESSION_SECONDS);
    setPhase("inspire");
    phaseRef.current = setInterval(() => {
      setPhase((p) => (p === "inspire" ? "expire" : "inspire"));
    }, PHASE_SECONDS * 1000);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { stop(); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  function stop() {
    setRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseRef.current) clearInterval(phaseRef.current);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <header className="sticky top-0 z-40 border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/journal"><AppLogo size="sm" /></Link>
          <Link href="/journal" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Mon journal
          </Link>
        </div>
      </header>

      <main className="relative flex-1 mx-auto w-full max-w-md px-4 sm:px-6 py-10 flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-coral-500 mb-2 flex items-center gap-1.5">
          <Wind className="h-3.5 w-3.5" />
          Pause respiration
        </p>
        <h1 className="font-display text-3xl font-semibold text-stone-900 leading-tight mb-3">
          Trois minutes<br />pour redescendre.
        </h1>
        <p className="text-stone-500 text-sm leading-relaxed mb-10 max-w-xs">
          Cohérence cardiaque : inspire 5 secondes quand le cercle grandit, expire 5 secondes
          quand il se resserre.
        </p>

        <div className={cn("flex flex-col items-center", isPremium === false && "blur-[6px] select-none pointer-events-none")}>
          {/* Cercle de respiration */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-8">
            <div
              className="absolute inset-0 rounded-full bg-coral-100/60"
              style={{
                transform: running && phase === "inspire" ? "scale(1)" : "scale(0.62)",
                transition: `transform ${PHASE_SECONDS}s ease-in-out`,
              }}
            />
            <div
              className="absolute inset-6 rounded-full bg-coral-300/50"
              style={{
                transform: running && phase === "inspire" ? "scale(1)" : "scale(0.6)",
                transition: `transform ${PHASE_SECONDS}s ease-in-out`,
              }}
            />
            <div className="relative w-24 h-24 rounded-full bg-coral-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-display text-lg font-semibold">
                {running ? (phase === "inspire" ? "Inspire" : "Expire") : "Prêt ?"}
              </span>
            </div>
          </div>

          <p className="font-display text-4xl font-semibold text-stone-900 mb-6 tabular-nums">
            {minutes}:{seconds}
          </p>

          <Button size="lg" onClick={running ? stop : start}>
            {running ? "Arrêter" : "Commencer"}
          </Button>
        </div>

        {/* Cadenas pour les comptes gratuits */}
        {isPremium === false && (
          <Link
            href="/paywall"
            className="absolute inset-x-0 bottom-0 top-40 flex flex-col items-center justify-center gap-2 bg-cream-100/40"
          >
            <div className="w-11 h-11 rounded-full bg-stone-900 flex items-center justify-center shadow-lg">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-semibold text-stone-900">Réservé aux abonnés</p>
            <p className="text-xs font-semibold text-coral-500">Débloquer →</p>
          </Link>
        )}
      </main>
    </div>
  );
}
