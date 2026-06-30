"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function JournalPhoneMockup() {
  return (
    <div className="relative mx-auto animate-float" style={{ maxWidth: 220 }}>
      <div className="absolute inset-0 rounded-[44px] bg-coral-400/20 blur-3xl scale-110 -z-10 animate-glow-pulse" />
      <svg
        viewBox="0 0 280 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full drop-shadow-2xl"
        aria-hidden="true"
      >
        {/* Phone shell */}
        <rect x="2" y="2" width="276" height="556" rx="46" fill="#211d18" stroke="#3d3630" strokeWidth="2" />
        <rect x="2" y="2" width="276" height="40" rx="46" fill="#211d18" />
        <rect x="81" y="10" width="118" height="24" rx="12" fill="#2e2a24" />
        {/* Screen */}
        <rect x="6" y="40" width="268" height="514" rx="42" fill="#F3ECDD" />
        {/* Status bar */}
        <text x="28" y="68" fontFamily="system-ui" fontSize="13" fontWeight="600" fill="#29251F">21:42</text>
        {/* Nav dots */}
        <rect x="28" y="92" width="26" height="5" rx="2.5" fill="#BD6E4C" />
        <rect x="58" y="92" width="9" height="5" rx="2.5" fill="#EAD4C6" />
        <rect x="71" y="92" width="9" height="5" rx="2.5" fill="#EAD4C6" />
        {/* Eyebrow */}
        <text x="28" y="140" fontFamily="system-ui" fontSize="10" fontWeight="700" letterSpacing="2" fill="#A55C3D">JOURNAL DU SOIR · IA</text>
        {/* Title */}
        <text x="28" y="170" fontFamily="Georgia,serif" fontSize="26" fontWeight="700" fill="#29251F">Pose ta journée</text>
        <text x="28" y="198" fontFamily="Georgia,serif" fontSize="26" fontWeight="700" fill="#29251F">avant de dormir.</text>
        {/* Body text lines */}
        <rect x="28" y="216" width="200" height="8" rx="4" fill="#E7DDCB" />
        <rect x="28" y="230" width="180" height="8" rx="4" fill="#E7DDCB" />
        <rect x="28" y="244" width="150" height="8" rx="4" fill="#E7DDCB" />
        {/* Mood chips */}
        <rect x="28" y="266" width="66" height="26" rx="13" fill="#F6E8DF" stroke="#EAD4C6" strokeWidth="1" />
        <circle cx="44" cy="279" r="5" fill="#BD6E4C" />
        <text x="54" y="283" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#5B554C">Mêlé</text>
        <rect x="100" y="266" width="68" height="26" rx="13" fill="#FCF8F0" stroke="#E7DDCB" strokeWidth="1" />
        <circle cx="115" cy="279" r="5" fill="#8FA086" />
        <text x="125" y="283" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#5B554C">Serein</text>
        <rect x="174" y="266" width="60" height="26" rx="13" fill="#FCF8F0" stroke="#E7DDCB" strokeWidth="1" />
        <circle cx="189" cy="279" r="5" fill="#CDA45C" />
        <text x="199" y="283" fontFamily="system-ui" fontSize="11" fontWeight="600" fill="#5B554C">Léger</text>
        {/* Journal text area */}
        <rect x="28" y="306" width="220" height="80" rx="14" fill="#FCF8F0" stroke="#E7DDCB" strokeWidth="1" />
        <text x="44" y="330" fontFamily="system-ui" fontSize="12" fill="#29251F">Grosse journée, la réunion</text>
        <text x="44" y="348" fontFamily="system-ui" fontSize="12" fill="#29251F">s&apos;est mieux passée…</text>
        <rect x="44" y="358" width="2" height="16" rx="1" fill="#BD6E4C" />
        {/* AI response bubble */}
        <rect x="28" y="402" width="220" height="72" rx="14" fill="#FBF7EE" stroke="#EAD4C6" strokeWidth="1" />
        <circle cx="44" cy="418" r="6" fill="#BD6E4C" />
        <text x="56" y="422" fontFamily="system-ui" fontSize="9" fontWeight="700" letterSpacing="1.5" fill="#A55C3D">ANCRAGE</text>
        <text x="40" y="440" fontFamily="system-ui" fontSize="11" fill="#29251F">Tu as tenu une journée</text>
        <text x="40" y="456" fontFamily="system-ui" fontSize="11" fill="#29251F">chargée avec brio. 🌿</text>
        {/* Bottom bar */}
        <rect x="6" y="494" width="268" height="60" rx="0" fill="#FBF7EE" />
        <line x1="6" y1="494" x2="274" y2="494" stroke="#E7DDCB" strokeWidth="1" />
        <rect x="28" y="511" width="144" height="26" rx="13" fill="#FCF8F0" stroke="#E7DDCB" strokeWidth="1" />
        <text x="50" y="529" fontFamily="system-ui" fontSize="11" fill="#988E80">Continuer à écrire…</text>
        <rect x="196" y="508" width="32" height="32" rx="16" fill="#E7DDCB" />
        <rect x="228" y="508" width="40" height="32" rx="16" fill="#BD6E4C" />
        <text x="242" y="530" fontFamily="system-ui" fontSize="16" fill="#FBF3EC">→</text>
      </svg>

      {/* Badge flottant */}
      <div className="absolute top-[14%] -right-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lift px-3 py-2 flex items-center gap-2 border border-cream-200 animate-float-delayed text-xs">
        <span className="w-2 h-2 rounded-full bg-coral-400 flex-none" />
        <span className="font-semibold text-stone-800">7 soirs d&apos;affilée</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-100 pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-coral-50/30" />
      <div className="pointer-events-none absolute top-0 right-0 w-[540px] h-[540px] rounded-full bg-coral-100/40 blur-[120px] -translate-y-1/3 translate-x-1/3" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <p className="inline-block text-xs font-semibold uppercase tracking-widest text-coral-500 mb-6 animate-fade-up">
              Journal du soir · IA
            </p>

            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-balance text-stone-900 mb-6 animate-fade-up animation-delay-100 leading-[1.06]">
              Pose ta journée<br />avant de dormir.
            </h1>

            <p className="mx-auto lg:mx-0 max-w-md text-lg text-stone-600 mb-8 leading-relaxed animate-fade-up animation-delay-200">
              Trois minutes pour écrire ou parler. Ancrage t&apos;écoute et te renvoie une pensée douce — pour fermer la journée l&apos;esprit plus léger.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4 animate-fade-up animation-delay-300">
              <Button asChild size="lg" className="px-8 h-14 text-base">
                <Link href="/auth">
                  Commencer ce soir
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <p className="text-sm text-stone-400 font-medium">
                Gratuit · 7 jours d&apos;essai · sans carte
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 animate-fade-up animation-delay-400">
              {[
                { color: "#BD6E4C", label: "Écris ou parle", sub: "Au clavier les soirs bavards, à la voix les soirs fatigués." },
                { color: "#8FA086", label: "Un reflet, pas un conseil", sub: "L'IA reformule et pose une question. Jamais de jugement." },
                { color: "#CDA45C", label: "Vois ta semaine", sub: "Tes humeurs se dessinent doucement, sans te noter." },
              ].map(({ color, label, sub }) => (
                <div key={label} className="flex items-start gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl flex-none flex items-center justify-center" style={{ background: "#F6E8DF" }}>
                    <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{label}</p>
                    <p className="text-stone-500 text-sm leading-relaxed">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-scale-in animation-delay-200">
            <JournalPhoneMockup />
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-16 max-w-sm mx-auto lg:mx-0 animate-fade-up animation-delay-500">
          <div className="bg-white border border-cream-200 rounded-2xl px-5 py-4 shadow-soft">
            <p className="font-display text-base font-medium text-stone-800 leading-snug">
              « Le seul moment de la journée où je m&apos;arrête vraiment. »
            </p>
            <p className="text-xs text-stone-400 mt-2">Léa, 27 ans</p>
          </div>
        </div>
      </div>
    </section>
  );
}
