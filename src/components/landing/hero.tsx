"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const DOTS: [number, number][] = [
  // forehead
  [140, 148], [112, 162], [168, 162], [124, 155], [156, 155],
  // temples
  [68, 238], [212, 238],
  // left brow
  [96, 206], [108, 198], [120, 196], [132, 198], [142, 206],
  // right brow
  [154, 206], [164, 198], [176, 196], [188, 198], [200, 206],
  // left eye
  [98, 222], [110, 215], [122, 213], [134, 215], [146, 222],
  [108, 232], [134, 232], [120, 238],
  // right eye
  [152, 222], [164, 215], [176, 213], [188, 215], [200, 222],
  [164, 232], [190, 232], [176, 238],
  // nose
  [140, 252], [136, 268], [140, 282], [144, 268],
  [128, 295], [140, 300], [152, 295],
  // cheeks
  [84, 276], [196, 276],
  // upper lip
  [118, 316], [128, 310], [140, 308], [152, 310], [162, 316],
  // lower lip
  [118, 328], [128, 334], [140, 336], [152, 334], [162, 328],
  // chin / jaw
  [140, 366], [120, 350], [160, 350],
  [82, 310], [80, 282], [198, 282], [198, 310],
];

const LINES: [[number, number], [number, number]][] = [
  // left eye
  [[98,222],[110,215]], [[110,215],[122,213]], [[122,213],[134,215]], [[134,215],[146,222]],
  [[98,222],[108,232]], [[146,222],[134,232]], [[108,232],[120,238]], [[134,232],[120,238]],
  // right eye
  [[152,222],[164,215]], [[164,215],[176,213]], [[176,213],[188,215]], [[188,215],[200,222]],
  [[152,222],[164,232]], [[200,222],[190,232]], [[164,232],[176,238]], [[190,232],[176,238]],
  // nose
  [[122,213],[136,268]], [[176,213],[144,268]],
  [[136,268],[140,282]], [[144,268],[140,282]],
  [[140,282],[128,295]], [[140,282],[152,295]], [[128,295],[140,300]], [[152,295],[140,300]],
  // forehead
  [[68,238],[112,162]], [[212,238],[168,162]], [[112,162],[140,148]], [[168,162],[140,148]],
  // jaw
  [[68,238],[80,282]], [[80,282],[82,310]], [[82,310],[120,350]], [[120,350],[140,366]],
  [[212,238],[198,282]], [[198,282],[198,310]], [[198,310],[160,350]], [[160,350],[140,366]],
  // cheeks
  [[84,276],[82,310]], [[196,276],[198,310]],
  // lips
  [[118,316],[128,310]], [[128,310],[140,308]], [[140,308],[152,310]], [[152,310],[162,316]],
  [[118,316],[118,328]], [[162,316],[162,328]],
  [[118,328],[128,334]], [[128,334],[140,336]], [[140,336],[152,334]], [[152,334],[162,328]],
  // brow to eye
  [[96,206],[98,222]], [[142,206],[146,222]], [[154,206],[152,222]], [[200,206],[200,222]],
  // temple to cheek
  [[68,238],[84,276]], [[212,238],[196,276]],
];

function ScanPhoneMockup() {
  return (
    <div className="relative mx-auto animate-float" style={{ maxWidth: 230 }}>
      <div className="absolute inset-0 rounded-[44px] bg-coral-300/30 blur-3xl scale-110 -z-10 animate-glow-pulse" />
      <svg
        viewBox="0 0 280 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full drop-shadow-2xl"
        aria-hidden="true"
      >
        {/* Phone shell */}
        <rect x="2" y="2" width="276" height="556" rx="46" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
        {/* Notch */}
        <rect x="2" y="2" width="276" height="40" rx="46" fill="#18181b" />
        <rect x="100" y="12" width="80" height="20" rx="10" fill="#27272a" />
        {/* Screen */}
        <rect x="6" y="42" width="268" height="512" rx="42" fill="#08080d" />

        {/* Face guide oval */}
        <ellipse cx="140" cy="272" rx="82" ry="112" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="7 5" opacity="0.75" />

        {/* Mesh lines */}
        {LINES.map((pair, i) => (
          <line
            key={i}
            x1={pair[0][0]} y1={pair[0][1]}
            x2={pair[1][0]} y2={pair[1][1]}
            stroke="#22c55e"
            strokeWidth="0.65"
            opacity="0.32"
          />
        ))}

        {/* Landmark dots */}
        {DOTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.2" fill="#22c55e" opacity="0.88" />
        ))}

        {/* Scanning sweep line */}
        <rect x="58" y="244" width="164" height="1.5" rx="1" fill="url(#sweep)" opacity="0.85" />

        {/* Top bar */}
        <rect x="14" y="50" width="252" height="34" rx="12" fill="rgba(0,0,0,0.55)" />
        <circle cx="34" cy="67" r="6" fill="#22c55e" opacity="0.85" />
        <circle cx="34" cy="67" r="3" fill="#16a34a" />

        {/* Bottom panel */}
        <rect x="14" y="462" width="252" height="82" rx="20" fill="rgba(0,0,0,0.72)" />

        {/* Score label + value */}
        <rect x="30" y="476" width="90" height="10" rx="4" fill="rgba(255,255,255,0.12)" />
        <rect x="30" y="476" width="72" height="10" rx="4" fill="rgba(255,255,255,0.22)" />

        {/* Progress bar */}
        <rect x="30" y="496" width="180" height="5" rx="2.5" fill="rgba(255,255,255,0.08)" />
        <rect x="30" y="496" width="148" height="5" rx="2.5" fill="#22c55e" opacity="0.8" />

        {/* Step dots */}
        <circle cx="115" cy="520" r="3.5" fill="#22c55e" opacity="0.9" />
        <circle cx="128" cy="520" r="3.5" fill="#22c55e" opacity="0.55" />
        <circle cx="141" cy="520" r="3.5" fill="#22c55e" opacity="0.3" />
        <circle cx="154" cy="520" r="3.5" fill="rgba(255,255,255,0.15)" />
        <circle cx="167" cy="520" r="3.5" fill="rgba(255,255,255,0.15)" />

        <defs>
          <linearGradient id="sweep" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34,197,94,0)" />
            <stop offset="50%" stopColor="rgba(34,197,94,0.9)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Score badge flottant */}
      <div className="absolute top-[16%] -right-8 glass rounded-2xl shadow-premium px-3.5 py-2.5 flex items-center gap-2 border border-white/60 animate-float-delayed">
        <span className="text-xl">✨</span>
        <div>
          <p className="text-[10px] text-stone-400 leading-none mb-0.5">Score cutané</p>
          <p className="text-base font-bold text-stone-900 leading-tight">87/100</p>
        </div>
      </div>

      {/* Age cutané badge */}
      <div className="absolute bottom-[20%] -left-10 glass rounded-2xl shadow-premium px-3.5 py-2.5 border border-white/60 animate-float">
        <p className="text-[10px] text-stone-400 leading-none mb-0.5">Âge cutané</p>
        <p className="text-base font-bold text-stone-900 leading-tight">24 ans</p>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();

  function handleScanClick() {
    // On va toujours vers /scan : le middleware redirige vers /auth si besoin,
    // et laisse passer l'utilisateur déjà connecté. Robuste et instantané.
    router.push("/scan");
  }

  return (
    <section className="grain relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-cream-50 to-coral-50/40" />
      <div className="pointer-events-none absolute top-0 right-0 w-[640px] h-[640px] rounded-full bg-coral-100/50 blur-[130px] -translate-y-1/3 translate-x-1/3 animate-glow-pulse" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[440px] h-[440px] rounded-full bg-champagne-100/60 blur-[110px] translate-y-1/2 -translate-x-1/4" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — texte + CTA */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full glass border border-coral-200/70 px-4 py-1.5 text-sm font-medium text-coral-600 mb-8 shadow-soft animate-fade-up shine">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-500" />
              </span>
              <span>+12 000 analyses cette semaine</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl font-bold text-balance text-stone-900 mb-6 animate-fade-up animation-delay-100">
              Découvre l&apos;âge réel
              <br />
              <span className="text-gradient-glow italic">de ta peau</span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-lg text-lg sm:text-xl text-stone-500 mb-8 text-pretty leading-relaxed animate-fade-up animation-delay-200">
              Prends un selfie. Notre IA analyse ta peau en quelques secondes
              et te donne ton score, ton âge cutané, et une routine sur-mesure.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 animate-fade-up animation-delay-300">
              <Button
                size="lg"
                className="px-8 h-14 text-base"
                onClick={handleScanClick}
              >
                Scanner ma peau
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
              <p className="text-sm text-stone-400 font-medium">
                Gratuit · Résultats en 10 secondes
              </p>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 animate-fade-up animation-delay-400">
              <div className="flex -space-x-2.5">
                {["#e8826a", "#D4B27A", "#eea593", "#C09A5E", "#dc6b51"].map((c, i) => (
                  <span
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${c}, ${c}cc)` }}
                  >
                    {["A", "M", "L", "C", "I"][i]}
                  </span>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="h-3 w-3 fill-champagne-400 text-champagne-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">Noté 4,9/5 par +3 000 utilisatrices</p>
              </div>
            </div>
          </div>

          {/* Right — mockup téléphone scan */}
          <div className="flex justify-center lg:justify-end animate-scale-in animation-delay-200">
            <ScanPhoneMockup />
          </div>
        </div>
      </div>

    </section>
  );
}
