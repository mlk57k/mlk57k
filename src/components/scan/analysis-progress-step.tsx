"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { skinAnalysisSchema, type SkinAnalysis } from "@/lib/scan-schema";

const STEPS = [
  "Cartographie des repères cutanés",
  "Stabilisation pose et lumière",
  "Segmentation des zones du visage",
  "Analyse de la texture et des pores",
  "Mesure de l'hydratation",
  "Détection des imperfections",
  "Calcul des scores par zone",
  "Score de confiance des repères",
  "Génération du diagnostic cutané",
] as const;

const STEP_INTERVAL_MS = 400;
const POST_STEPS_DELAY_MS = 800;
const RADIUS = 56;
const CIRC = 2 * Math.PI * RADIUS;

interface Props {
  imageDataUrl: string;
  onComplete: (data: SkinAnalysis) => void;
  onError: (msg: string) => void;
}

export function AnalysisProgressStep({ imageDataUrl, onComplete, onError }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [done, setDone] = useState(false);
  const calledRef = useRef(false);

  const progress = STEPS.length > 0 ? visibleCount / STEPS.length : 0;
  const dashOffset = CIRC * (1 - progress);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1);
      }, (i + 1) * STEP_INTERVAL_MS);
      timers.push(t);
    });

    const apiTimer = setTimeout(async () => {
      try {
        const res = await fetch("/api/analyze-skin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imageDataUrl }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null) as { error?: string } | null;
          onError(data?.error ?? "L'analyse a échoué. Réessaie.");
          return;
        }

        const json = await res.json() as unknown;
        const parsed = skinAnalysisSchema.safeParse(json);
        if (!parsed.success) {
          onError("Réponse inattendue. Réessaie dans un instant.");
          return;
        }

        setDone(true);
        setTimeout(() => {
          onComplete(parsed.data);
        }, 600);
      } catch {
        onError("Impossible de contacter le serveur. Réessaie.");
      }
    }, STEPS.length * STEP_INTERVAL_MS + POST_STEPS_DELAY_MS);

    timers.push(apiTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [imageDataUrl, onComplete, onError]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl shadow-black/50 space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center">
              <svg
                width={128}
                height={128}
                viewBox="0 0 128 128"
                fill="none"
                className="-rotate-90"
              >
                <circle
                  cx="64"
                  cy="64"
                  r={RADIUS}
                  stroke="white"
                  strokeOpacity="0.06"
                  strokeWidth="3"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={RADIUS}
                  stroke="url(#progressGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.4s ease-out" }}
                />
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0"
                    y1="0"
                    x2="128"
                    y2="0"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor="#e8826a" />
                    <stop offset="100%" stopColor="#eea593" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                {done ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-400/20">
                    <Check className="h-5 w-5 text-coral-400" />
                  </div>
                ) : (
                  <span className="font-display font-bold text-white text-2xl leading-none">
                    {Math.round(progress * 100)}
                    <span className="text-sm font-sans font-normal text-white/40">%</span>
                  </span>
                )}
              </div>
            </div>

            {done ? (
              <p className="text-white font-semibold text-sm tracking-wide">
                Analyse terminée !
              </p>
            ) : (
              <p className="text-white/50 text-xs font-medium tracking-widest uppercase">
                Analyse en cours
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            {STEPS.map((step, i) => {
              const isVisible = i < visibleCount;
              const isActive = i === visibleCount - 1 && !done;
              const isDone = i < visibleCount - 1 || (isVisible && done);

              return (
                <div
                  key={step}
                  className="flex items-center gap-3 transition-opacity duration-300"
                  style={{ opacity: isVisible ? 1 : 0.2 }}
                >
                  <div className="shrink-0 flex h-5 w-5 items-center justify-center">
                    {isDone || (isVisible && !isActive) ? (
                      <Check className="h-3.5 w-3.5 text-coral-400" />
                    ) : isActive ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    )}
                  </div>
                  <span
                    className="text-sm leading-snug transition-colors duration-200"
                    style={{
                      color: isDone || (isVisible && !isActive)
                        ? "rgba(255,255,255,0.6)"
                        : isActive
                        ? "rgba(255,255,255,1)"
                        : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-white/25 text-xs font-medium tracking-wide">
          Ne fermez pas cette page
        </p>
      </div>
    </div>
  );
}
