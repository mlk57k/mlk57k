"use client";

import { useState, useRef, useCallback } from "react";

function FaceSVG({ variant }: { variant: "before" | "after" }) {
  const isBefore = variant === "before";

  const skinBase = isBefore ? "#C4855A" : "#F0B090";
  const skinShadow = isBefore ? "#A8694A" : "#D9926E";

  return (
    <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Glow / halo */}
      {!isBefore && (
        <radialGradient id="glow_after" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF0E8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFF0E8" stopOpacity="0" />
        </radialGradient>
      )}

      {/* Background */}
      <rect width="200" height="240" fill={isBefore ? "#F5F0EB" : "#FDF7F3"} />
      {!isBefore && <ellipse cx="100" cy="90" rx="90" ry="80" fill="url(#glow_after)" opacity="0.7" />}

      {/* Neck */}
      <path d="M80 192 Q100 200 120 192 L116 220 Q100 226 84 220 Z" fill={skinBase} />

      {/* Face shape */}
      <ellipse cx="100" cy="115" rx="66" ry="82" fill={skinBase} />

      {/* Dull overlay on before */}
      {isBefore && <ellipse cx="100" cy="115" rx="66" ry="82" fill="rgba(0,0,0,0.07)" />}

      {/* Face contour shadow */}
      <ellipse cx="100" cy="115" rx="66" ry="82" fill="none" stroke={skinShadow} strokeWidth="0.5" opacity="0.5" />

      {/* Cheek highlights (after only) */}
      {!isBefore && (
        <>
          <ellipse cx="68" cy="130" rx="14" ry="10" fill="rgba(255,200,170,0.35)" />
          <ellipse cx="132" cy="130" rx="14" ry="10" fill="rgba(255,200,170,0.35)" />
        </>
      )}

      {/* Forehead highlight */}
      <ellipse cx="100" cy="72" rx="30" ry="16" fill={isBefore ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.25)"} />

      {/* ── Eyes ── */}
      {/* Left eye */}
      <ellipse cx="76" cy="112" rx="12" ry="7" fill={isBefore ? "#8B6555" : "#6B4030"} opacity={isBefore ? 0.9 : 1} />
      <ellipse cx="76" cy="112" rx="7" ry="5" fill="#1a0a05" />
      <circle cx="78" cy="110" r="1.5" fill="white" opacity="0.8" />
      {/* Dark circles before */}
      {isBefore && <ellipse cx="76" cy="119" rx="12" ry="5" fill="rgba(80,40,20,0.18)" />}

      {/* Right eye */}
      <ellipse cx="124" cy="112" rx="12" ry="7" fill={isBefore ? "#8B6555" : "#6B4030"} opacity={isBefore ? 0.9 : 1} />
      <ellipse cx="124" cy="112" rx="7" ry="5" fill="#1a0a05" />
      <circle cx="126" cy="110" r="1.5" fill="white" opacity="0.8" />
      {isBefore && <ellipse cx="124" cy="119" rx="12" ry="5" fill="rgba(80,40,20,0.18)" />}

      {/* Eyebrows */}
      <path d="M64 104 Q76 100 88 103" stroke={isBefore ? "#6B4030" : "#5A3020"} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M112 103 Q124 100 136 104" stroke={isBefore ? "#6B4030" : "#5A3020"} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M100 118 Q97 130 94 138 Q100 142 106 138 Q103 130 100 118Z" fill={skinShadow} opacity="0.55" />
      {isBefore && (
        <>
          {/* Redness around nose wings */}
          <ellipse cx="91" cy="138" rx="5" ry="3" fill="rgba(200,80,60,0.2)" />
          <ellipse cx="109" cy="138" rx="5" ry="3" fill="rgba(200,80,60,0.2)" />
        </>
      )}

      {/* Mouth */}
      <path d="M86 158 Q100 165 114 158" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M88 158 Q100 162 112 158" fill={isBefore ? "#C47A5A" : "#D4836A"} opacity="0.7" />

      {/* Imperfections (before only) */}
      {isBefore && (
        <>
          {/* Spots / blemishes */}
          <circle cx="84" cy="138" r="2.5" fill="rgba(160,60,40,0.4)" />
          <circle cx="116" cy="95" r="1.8" fill="rgba(160,60,40,0.35)" />
          <circle cx="92" cy="88" r="1.5" fill="rgba(160,60,40,0.3)" />
          {/* Uneven texture */}
          <circle cx="60" cy="118" r="4" fill="rgba(200,120,80,0.15)" />
          <circle cx="140" cy="122" r="3.5" fill="rgba(200,120,80,0.15)" />
          {/* Redness cheeks */}
          <ellipse cx="58" cy="132" rx="12" ry="8" fill="rgba(210,80,60,0.12)" />
          <ellipse cx="142" cy="132" rx="12" ry="8" fill="rgba(210,80,60,0.12)" />
        </>
      )}

      {/* Skin glow dots (after only) */}
      {!isBefore && (
        <>
          <circle cx="68" cy="126" r="3" fill="rgba(255,230,200,0.5)" />
          <circle cx="132" cy="126" r="3" fill="rgba(255,230,200,0.5)" />
          <circle cx="100" cy="76" r="4" fill="rgba(255,240,220,0.45)" />
        </>
      )}
    </svg>
  );
}

export function BeforeAfter() {
  const [sliderX, setSliderX] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSliderX(pct);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    updateSlider(e.clientX);
    e.preventDefault();
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging.current) updateSlider(e.clientX);
  }, [updateSlider]);

  const onMouseUp = () => { dragging.current = false; };

  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    updateSlider(e.touches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (dragging.current) updateSlider(e.touches[0].clientX);
  };

  const onTouchEnd = () => { dragging.current = false; };

  return (
    <section className="py-20 sm:py-28 bg-cream-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-coral-400 font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            Résultats visibles
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900 mb-4">
            La différence Glowy
          </h2>
          <p className="text-stone-500 text-lg max-w-md mx-auto">
            4 semaines de routine personnalisée. Glisse pour comparer.
          </p>
        </div>

        <div className="flex justify-center">
          <div
            ref={containerRef}
            className="relative select-none overflow-hidden rounded-3xl shadow-2xl shadow-stone-200 cursor-col-resize"
            style={{ width: "100%", maxWidth: 480, aspectRatio: "4/3" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* After (full width, behind) */}
            <div className="absolute inset-0">
              <FaceSVG variant="after" />
            </div>

            {/* Before (clipped to left of slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderX}%` }}
            >
              <div style={{ width: "480px", maxWidth: "100vw", height: "100%" }}>
                <FaceSVG variant="before" />
              </div>
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.25)]"
              style={{ left: `${sliderX}%`, transform: "translateX(-50%)" }}
            >
              {/* Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center">
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                  <path d="M5 7H1M13 7H17" stroke="#9B7B6A" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 4L1 7L3 10M15 4L17 7L15 10" stroke="#9B7B6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Before label */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-stone-800/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex flex-col">
                <span className="text-white text-xs font-bold leading-tight">Avant</span>
                <span className="text-white/50 text-[10px] leading-tight">Sans Glowy</span>
              </div>
              <div className="mt-2 bg-stone-800/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-stone-300 text-[10px] font-semibold">Score 48</span>
              </div>
            </div>

            {/* After label */}
            <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end">
              <div className="bg-coral-400 rounded-full px-3 py-1.5 flex flex-col items-end">
                <span className="text-white text-xs font-bold leading-tight">Après 4 semaines</span>
                <span className="text-white/70 text-[10px] leading-tight">Avec Glowy</span>
              </div>
              <div className="mt-2 bg-coral-400/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-white text-[10px] font-semibold">Score 87 ✨</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics row */}
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { label: "Éclat", before: "+0%", after: "+41%" },
            { label: "Hydratation", before: "–", after: "+28%" },
            { label: "Score moyen", before: "48", after: "87" },
          ].map((m) => (
            <div key={m.label} className="text-center rounded-2xl bg-white border border-cream-200 px-3 py-4">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">{m.label}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-stone-400 text-sm font-medium line-through">{m.before}</span>
                <span className="text-coral-400 text-base font-bold">{m.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
