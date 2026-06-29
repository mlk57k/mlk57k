import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grain relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-900 via-stone-900 to-[#2a1d18] p-10 sm:p-16 text-center shadow-premium">
          {/* Blobs décoratifs dans le fond sombre */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[320px] rounded-full bg-coral-400/25 blur-[90px] animate-glow-pulse" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 w-[300px] h-[300px] rounded-full bg-champagne-400/15 blur-[80px]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full glass-dark border border-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-coral-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Gratuit · 30 secondes
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
              Ton aperçu peau<br className="hidden sm:block" />{" "}
              <span className="text-gradient-glow italic">t&apos;attend</span>
            </h2>
            <p className="text-stone-300/80 mb-10 max-w-md mx-auto text-base leading-relaxed">
              Rejoins des milliers de personnes qui ont découvert l&apos;état réel
              de leur peau. Aucun compte requis.
            </p>
            <Button
              asChild
              size="lg"
              className="px-8 h-14 text-base"
            >
              <Link href="/scan">
                Scanner ma peau
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
