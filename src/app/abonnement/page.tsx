"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { AppLogo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "weekly" as const,
    label: "Hebdomadaire",
    price: "4,99 €",
    cadence: "/ semaine",
  },
  {
    id: "monthly" as const,
    label: "Mensuel",
    price: "9,99 €",
    cadence: "/ mois",
    highlight: true,
    note: "Le plus populaire",
  },
];

const BENEFITS = [
  "Entrées de journal illimitées",
  "Bilans hebdomadaires personnalisés",
  "Le coach se souvient de tes sessions précédentes",
  "Export PDF et texte à tout moment",
  "Annulation en 1 clic, sans engagement",
];

export default function AbonnementPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<"weekly" | "monthly">("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const { data: { user } } = await createClient().auth.getUser();
      if (!user) router.replace("/auth?next=/abonnement");
    })();
  }, [router]);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      throw new Error(data.error ?? "Erreur inconnue.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="border-b border-cream-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center">
          <Link href="/journal"><AppLogo size="md" /></Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            Continue ton chemin, sans limite
          </h1>
          <p className="text-stone-500 max-w-md mx-auto">
            3 jours d&apos;essai gratuit, puis le tarif de ton choix. Annulable en un clic, à
            tout moment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              className={cn(
                "text-left rounded-2xl border-2 p-6 transition-all",
                plan === p.id
                  ? "border-coral-400 bg-white shadow-lift"
                  : "border-cream-200 bg-white/60 hover:border-coral-200"
              )}
            >
              {p.note && (
                <span className="inline-block mb-2 text-xs font-semibold uppercase tracking-wide text-coral-500">
                  {p.note}
                </span>
              )}
              <p className="font-display text-2xl font-bold text-stone-900">
                {p.price} <span className="text-sm font-normal text-stone-400">{p.cadence}</span>
              </p>
              <p className="text-sm text-stone-500 mt-1">{p.label}</p>
            </button>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-stone-600">
                <Check className="h-4 w-4 text-coral-400 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </Card>

        {error && <p className="text-sm text-coral-500 text-center mb-4">{error}</p>}

        <Button size="lg" className="w-full" disabled={loading} onClick={handleSubscribe}>
          {loading ? "Redirection…" : "Démarrer mon essai gratuit"}
        </Button>
        <p className="text-center text-xs text-stone-400 mt-3">
          Tu peux annuler à tout moment depuis tes paramètres, en un clic.
        </p>
      </main>
    </div>
  );
}
