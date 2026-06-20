"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

function BeforeAfterSlider() {
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

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-3xl shadow-2xl shadow-stone-200/60 select-none cursor-col-resize touch-none aspect-[4/3]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="Comparaison avant/après — glissez pour comparer"
      >
        {/* AVANT panel (left, always full) */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-30">
            {[
              { top: "28%", left: "38%", size: 3 },
              { top: "42%", left: "55%", size: 2 },
              { top: "35%", left: "62%", size: 2.5 },
              { top: "55%", left: "44%", size: 2 },
              { top: "48%", left: "36%", size: 3.5 },
              { top: "33%", left: "48%", size: 2 },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-amber-600"
                style={{
                  top: dot.top,
                  left: dot.left,
                  width: `${dot.size * 3}px`,
                  height: `${dot.size * 3}px`,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-amber-200/40 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center rounded-full bg-black/25 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-white tracking-wide uppercase">
              Avant
            </span>
          </div>
        </div>

        {/* APRÈS panel (right, clipped) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-rose-200/30" />
          <div className="absolute inset-0">
            <div
              className="absolute rounded-full bg-coral-200/40 blur-2xl"
              style={{ top: "20%", left: "30%", width: "50%", height: "50%" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-rose-100/40 to-transparent" />
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center rounded-full bg-coral-400 px-3 py-1 text-[11px] font-semibold text-white tracking-wide uppercase">
              4 semaines
            </span>
          </div>
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          style={{ left: `${position}%` }}
        />

        {/* Drag handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg shadow-black/20 ring-1 ring-black/5"
          style={{ left: `${position}%` }}
        >
          <ChevronLeft className="h-3.5 w-3.5 text-stone-500 -mr-0.5" />
          <ChevronRight className="h-3.5 w-3.5 text-stone-500 -ml-0.5" />
        </div>
      </div>

      <p className="text-center text-xs text-stone-400 font-medium tracking-wide">
        Glisse pour comparer
      </p>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-cream-50 to-coral-50/30" />
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-coral-50/60 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cream-100/80 blur-[100px] translate-y-1/2 -translate-x-1/4" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-coral-50 border border-coral-200 px-4 py-1.5 text-sm font-medium text-coral-600 mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          <span>+12 000 analyses cette semaine</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-balance text-stone-900 mb-6">
          Découvre l&apos;âge réel
          <br />
          <span className="text-gradient-coral italic">de ta peau</span>
        </h1>

        <p className="mx-auto max-w-lg text-lg sm:text-xl text-stone-500 mb-10 text-pretty leading-relaxed">
          Prends une selfie. Notre IA analyse ta peau en quelques secondes
          et te donne ton score, ton âge cutané, et une routine sur-mesure.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-coral-400 hover:bg-coral-500 text-white border-none shadow-xl shadow-coral-200/50 px-8 h-14 text-base font-semibold"
          >
            <Link href="/scan">
              Scanner ma peau
              <ArrowRight className="h-5 w-5 ml-1" />
            </Link>
          </Button>
          <p className="text-sm text-stone-400 font-medium">Gratuit · Aucun compte requis</p>
        </div>

        <div className="mt-16 mx-auto max-w-xs">
          <BeforeAfterSlider />
        </div>
      </div>
    </section>
  );
}
