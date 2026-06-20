"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

function FaceIllustration({ variant }: { variant: "before" | "after" }) {
  const id = variant;
  const skinLight = variant === "before" ? "#D4906A" : "#E8A882";
  const skinMid   = variant === "before" ? "#C07850" : "#D08C6A";
  const hairColor = "#261008";

  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`skin-${id}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor={skinLight} />
          <stop offset="100%" stopColor={skinMid} />
        </radialGradient>
        {variant === "after" && (
          <radialGradient id="glow" cx="50%" cy="35%" r="45%">
            <stop offset="0%" stopColor="rgba(255,230,210,0.55)" />
            <stop offset="100%" stopColor="rgba(255,230,210,0)" />
          </radialGradient>
        )}
      </defs>

      {/* Neck */}
      <rect x="165" y="278" width="70" height="30" rx="6" fill={`url(#skin-${id})`} />

      {/* Face oval */}
      <ellipse cx="200" cy="168" rx="92" ry="118" fill={`url(#skin-${id})`} />

      {/* AVANT — imperfections */}
      {variant === "before" && (
        <>
          <ellipse cx="148" cy="195" rx="28" ry="22" fill="#B85040" opacity="0.32" />
          <ellipse cx="254" cy="200" rx="25" ry="20" fill="#B85040" opacity="0.28" />
          <circle cx="138" cy="173" r="4"   fill="#8B3020" opacity="0.68" />
          <circle cx="152" cy="215" r="3"   fill="#8B3020" opacity="0.58" />
          <circle cx="260" cy="185" r="3.5" fill="#8B3020" opacity="0.62" />
          <circle cx="244" cy="222" r="2.5" fill="#8B3020" opacity="0.52" />
          <circle cx="180" cy="148" r="2.5" fill="#8B3020" opacity="0.50" />
          <circle cx="220" cy="240" r="3"   fill="#8B3020" opacity="0.55" />
          <ellipse cx="200" cy="168" rx="92" ry="118" fill="#60180000" opacity="0.06" />
        </>
      )}

      {/* APRÈS — éclat */}
      {variant === "after" && (
        <>
          <ellipse cx="200" cy="130" rx="72" ry="85" fill="url(#glow)" />
          <ellipse cx="145" cy="208" rx="28" ry="22" fill="#E89080" opacity="0.18" />
          <ellipse cx="255" cy="208" rx="28" ry="22" fill="#E89080" opacity="0.18" />
        </>
      )}

      {/* Ears */}
      <ellipse cx="108" cy="168" rx="14" ry="19" fill={skinMid} />
      <ellipse cx="292" cy="168" rx="14" ry="19" fill={skinMid} />

      {/* Hair */}
      <path
        d="M108 140 Q115 28 200 14 Q285 28 292 140 Q262 60 200 65 Q138 60 108 140Z"
        fill={hairColor}
      />

      {/* Left brow */}
      <path d="M148 118 Q168 106 190 113" stroke={hairColor} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* Right brow */}
      <path d="M210 113 Q232 106 252 118" stroke={hairColor} strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Left eye */}
      <ellipse cx="170" cy="141" rx="20" ry="13" fill="white" />
      <circle  cx="170" cy="141" r="9"  fill="#5A3018" />
      <circle  cx="170" cy="141" r="5"  fill="#120800" />
      <circle  cx="174" cy="137" r="2.8" fill="white" />
      <path d="M150 141 Q170 132 190 141" stroke="#180800" strokeWidth="1.8" fill="none" opacity="0.5" />

      {/* Right eye */}
      <ellipse cx="230" cy="141" rx="20" ry="13" fill="white" />
      <circle  cx="230" cy="141" r="9"  fill="#5A3018" />
      <circle  cx="230" cy="141" r="5"  fill="#120800" />
      <circle  cx="234" cy="137" r="2.8" fill="white" />
      <path d="M210 141 Q230 132 250 141" stroke="#180800" strokeWidth="1.8" fill="none" opacity="0.5" />

      {/* Nose */}
      <path d="M196 162 Q190 192 180 202 Q196 210 220 202 Q228 192 204 162" fill={skinMid} opacity="0.45" />
      <ellipse cx="183" cy="201" rx="7" ry="5" fill={skinMid} opacity="0.7" />
      <ellipse cx="217" cy="201" rx="7" ry="5" fill={skinMid} opacity="0.7" />

      {/* Lips */}
      <path d="M168 242 Q186 234 200 237 Q214 234 232 242 Q214 248 200 245 Q186 248 168 242Z" fill="#C86060" />
      <path d="M168 242 Q186 258 200 260 Q214 258 232 242 Q214 248 200 245 Q186 248 168 242Z" fill="#B05050" />
      <path d="M176 236 Q190 229 200 232 Q210 229 224 236" stroke="#944040" strokeWidth="1.2" fill="none" opacity="0.6" />

      {/* Chin highlight */}
      <ellipse cx="200" cy="278" rx="28" ry="8" fill={skinLight} opacity="0.4" />
    </svg>
  );
}

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
        aria-label="Comparaison avant/après Glowy — glissez pour comparer"
      >
        {/* SANS GLOWY panel */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200">
          <FaceIllustration variant="before" />
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center rounded-full bg-black/30 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-white tracking-wide">
              Sans Glowy
            </span>
          </div>
        </div>

        {/* AVEC GLOWY panel */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-rose-50 via-cream-50 to-coral-50"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <FaceIllustration variant="after" />
          <div className="absolute bottom-4 right-4">
            <span className="inline-flex items-center rounded-full bg-coral-400 px-3 py-1 text-[11px] font-semibold text-white tracking-wide">
              Avec Glowy
            </span>
          </div>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-px bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ left: `${position}%` }}
        />

        {/* Handle */}
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
          <p className="text-sm text-stone-400 font-medium">Gratuit · Résultats en 10 secondes</p>
        </div>

        <div className="mt-16 mx-auto max-w-xs">
          <BeforeAfterSlider />
        </div>
      </div>
    </section>
  );
}
