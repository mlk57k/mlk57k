"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Check, Loader2, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    id: "monthly" as const,
    label: "Mensuel",
    price: "7,99 €",
    period: "/ mois",
    detail: null,
    badge: null,
    priceEnvKey: "NEXT_PUBLIC_STRIPE_PRICE_MONTHLY",
    highlight: false,
  },
  {
    id: "annual" as const,
    label: "Annuel",
    price: "3,25 €",
    period: "/ mois",
    detail: "39 € facturés une fois par an",
    badge: "Économise 60 %",
    priceEnvKey: "NEXT_PUBLIC_STRIPE_PRICE_ANNUAL",
    highlight: true,
  },
] as const;

const PERKS = [
  "Routine personnalisée débloquée",
  "Accès à tous tes scans",
  "Suivi d'évolution de ton score",
  "Conseils produits adaptés",
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"monthly" | "annual">("annual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    const priceId =
      selected === "monthly"
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL;

    if (!priceId) {
      setError("Configuration Stripe manquante. Reviens plus tard !");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (res.status === 401) {
        router.push("/auth?next=/checkout");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Impossible de contacter le serveur. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-glowy flex flex-col">
      {/* Header */}
      <header className="px-4 h-14 flex items-center justify-center border-b border-beige-200/50 bg-beige-50/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-coral-500" />
          <span className="text-gradient-coral">Glowy</span>
        </Link>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-4 py-10 flex flex-col gap-8">
        {/* Hero */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-coral-50 mb-2">
            <Sparkles className="h-7 w-7 text-coral-500" />
          </div>
          <h1 className="text-2xl font-bold">Débloque ta routine Glowy</h1>
          <p className="text-sm text-muted-foreground">
            7 jours gratuits, annule à tout moment.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-2 gap-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={[
                "relative rounded-2xl border-2 p-4 text-left transition-all",
                selected === plan.id
                  ? "border-coral-500 bg-coral-50/60 shadow-md"
                  : "border-beige-200 bg-white/60 hover:border-coral-300",
              ].join(" ")}
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-coral-500 px-2.5 py-0.5 text-[11px] font-semibold text-white whitespace-nowrap">
                  <Star className="h-3 w-3" />
                  {plan.badge}
                </span>
              )}
              <p className="text-xs font-medium text-muted-foreground mb-1">{plan.label}</p>
              <p className="text-2xl font-bold leading-none">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {plan.period}
                </span>
              </p>
              {plan.detail && (
                <p className="text-[11px] text-muted-foreground mt-1">{plan.detail}</p>
              )}
              {/* Checkmark when selected */}
              {selected === plan.id && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500">
                  <Check className="h-3 w-3 text-white" />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Perks */}
        <ul className="space-y-2.5">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm">
              <Check className="h-4 w-4 text-coral-500 shrink-0" />
              {perk}
            </li>
          ))}
        </ul>

        {/* Error */}
        {error && (
          <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* CTA */}
        <div className="space-y-3">
          <Button
            className="w-full bg-coral-500 hover:bg-coral-600 text-white h-12 text-base font-semibold shadow-md"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Commencer 7 jours gratuits"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            Sans engagement · Paiement sécurisé par Stripe
          </p>
        </div>
      </main>
    </div>
  );
}
