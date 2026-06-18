import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coral-500 to-coral-600 p-8 sm:p-12 text-center text-white">
          {/* Orbes */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <p className="text-coral-100 font-medium mb-3 text-sm uppercase tracking-widest">
              Gratuit · 10 secondes
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ton aperçu peau t&apos;attend
            </h2>
            <p className="text-coral-100 mb-8 max-w-md mx-auto">
              Rejoins les milliers de personnes qui ont déjà découvert l&apos;état réel
              de leur peau. Aucun compte requis pour commencer.
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white text-coral-600 hover:bg-coral-50 shadow-xl"
            >
              <Link href="/scan">
                <Zap className="h-5 w-5" />
                Scanner mon visage
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
