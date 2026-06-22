"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
    <div className="relative mx-auto" style={{ maxWidth: 220 }}>
      <div className="absolute inset-0 rounded-[44px] bg-coral-300/25 blur-3xl scale-110 -z-10" />
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
      <div className="absolute top-[18%] -right-6 bg-white rounded-2xl shadow-xl shadow-black/10 px-3 py-2 flex items-center gap-2 border border-cream-100">
        <span className="text-xl">✨</span>
        <div>
          <p className="text-[10px] text-stone-400 leading-none">Score cutané</p>
          <p className="text-base font-bold text-stone-900 leading-tight">87/100</p>
        </div>
      </div>

      {/* Age cutané badge */}
      <div className="absolute bottom-[22%] -left-8 bg-white rounded-2xl shadow-xl shadow-black/10 px-3 py-2 border border-cream-100">
        <p className="text-[10px] text-stone-400 leading-none">Âge cutané</p>
        <p className="text-base font-bold text-stone-900 leading-tight">24 ans</p>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();

  async function handleScanClick() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push("/auth?next=/scan");
      return;
    }
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/scan");
      } else {
        router.push("/auth?next=/scan");
      }
    } catch {
      router.push("/auth?next=/scan");
    }
  }

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-cream-50 to-coral-50/30" />
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-coral-50/60 blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cream-100/80 blur-[100px] translate-y-1/2 -translate-x-1/4" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — texte + CTA */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral-50 border border-coral-200 px-4 py-1.5 text-sm font-medium text-coral-600 mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              <span>+12 000 analyses cette semaine</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl font-bold text-balance text-stone-900 mb-6">
              Découvre l&apos;âge réel
              <br />
              <span className="text-gradient-coral italic">de ta peau</span>
            </h1>

            <p className="mx-auto lg:mx-0 max-w-lg text-lg sm:text-xl text-stone-500 mb-10 text-pretty leading-relaxed">
              Prends une selfie. Notre IA analyse ta peau en quelques secondes
              et te donne ton score, ton âge cutané, et une routine sur-mesure.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
              <Button
                size="lg"
                className="rounded-full bg-coral-400 hover:bg-coral-500 text-white border-none shadow-xl shadow-coral-200/50 px-8 h-14 text-base font-semibold"
                onClick={handleScanClick}
              >
                Scanner ma peau
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
              <p className="text-sm text-stone-400 font-medium">
                Gratuit · Résultats en 10 secondes
              </p>
            </div>
          </div>

          {/* Right — mockup téléphone scan */}
          <div className="flex justify-center lg:justify-end">
            <ScanPhoneMockup />
          </div>
        </div>
      </div>

    </section>
  );
}
