"use client";

import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SkinAnalysis } from "@/lib/scan-schema";

interface Props {
  imageDataUrl: string;
  analysis: SkinAnalysis;
  onContinue: () => void;
}

export function RevealStep({ imageDataUrl, analysis, onContinue }: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const afterScore = Math.min(100, analysis.skin_score + 32);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto space-y-5">
        <div className="text-center space-y-1">
          <h2 className="font-display text-2xl font-bold text-white">
            La différence Glowy
          </h2>
          <p className="text-sm text-white/50">
            Glisse pour voir ton potentiel
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/60 select-none cursor-col-resize touch-none aspect-[3/4]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="Comparaison avant/après — glissez pour comparer"
        >
          {/* AVANT — photo originale légèrement atténuée */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Avant"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.82) saturate(0.75) contrast(1.08)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-14 left-3">
              <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white tracking-wide">
                Score {analysis.skin_score}
              </span>
            </div>
            <div className="absolute bottom-4 left-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <p className="text-[12px] font-bold text-white leading-tight">Avant</p>
              <p className="text-[10px] text-white/60 leading-tight">Sans Glowy</p>
            </div>
          </div>

          {/* APRÈS — photo avec filtre éclat + overlay chaud */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Après"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(1.14) saturate(1.28) contrast(0.92)" }}
            />
            {/* Halo lumineux radial */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 28%, rgba(255,200,170,0.22) 0%, transparent 62%)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-14 right-3">
              <span className="inline-flex items-center rounded-full bg-coral-400 px-3 py-1 text-[11px] font-bold text-white tracking-wide">
                Score {afterScore} ✨
              </span>
            </div>
            <div className="absolute bottom-4 right-3 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-right">
              <p className="text-[12px] font-bold text-white leading-tight">
                Après 4 semaines
              </p>
              <p className="text-[10px] text-white/60 leading-tight">Avec Glowy</p>
            </div>
          </div>

          {/* Séparateur */}
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: `${position}%` }}
          />

          {/* Poignée */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/30 ring-1 ring-black/10"
            style={{ left: `${position}%` }}
          >
            <ChevronLeft className="h-3.5 w-3.5 text-stone-500 -mr-0.5" />
            <ChevronRight className="h-3.5 w-3.5 text-stone-500 -ml-0.5" />
          </div>
        </div>

        <p className="text-center text-xs text-white/30 font-medium tracking-wide">
          Glisse pour comparer
        </p>

        <Button
          size="lg"
          className="w-full rounded-full bg-coral-400 hover:bg-coral-500 text-white border-none h-14 text-base font-semibold shadow-xl shadow-coral-900/30"
          onClick={onContinue}
        >
          Voir mes résultats complets
          <ArrowRight className="h-5 w-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
