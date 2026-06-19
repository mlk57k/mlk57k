import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 p-10 sm:p-16 text-center">
          {/* Blob décoratif coral dans le fond sombre */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-coral-400/20 blur-[80px]" />

          <div className="relative">
            <p className="text-coral-300 font-semibold text-xs uppercase tracking-[0.2em] mb-5">
              Gratuit · 30 secondes
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 text-balance">
              Ton aperçu peau<br className="hidden sm:block" /> t&apos;attend
            </h2>
            <p className="text-stone-400 mb-10 max-w-md mx-auto text-base leading-relaxed">
              Rejoins des milliers de personnes qui ont découvert l&apos;état réel
              de leur peau. Aucun compte requis.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-coral-400 hover:bg-coral-500 text-white border-none shadow-xl shadow-coral-400/30 px-8 h-14 text-base font-semibold"
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
