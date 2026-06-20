"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { GlowyLogo } from "@/components/ui/logo";

type PlanId = "monthly" | "annual";

interface Plan {
  id: PlanId;
  label: string;
  price: string;
  priceNum: string;
  period: string;
  detail: string | null;
  badge: string | null;
}

const PLANS: Plan[] = [
  {
    id: "monthly",
    label: "Mensuel",
    price: "7,99",
    priceNum: "7,99",
    period: "/ mois",
    detail: null,
    badge: null,
  },
  {
    id: "annual",
    label: "Annuel",
    price: "3,25",
    priceNum: "3,25",
    period: "/ mois",
    detail: "39 € facturés une fois par an",
    badge: "ÉCO",
  },
];

interface Feature {
  text: string;
  badge?: {
    label: string;
    variant: "blue" | "coral";
  };
}

const FEATURES: Feature[] = [
  { text: "Une analyse de peau chaque semaine" },
  { text: "Protocole sur mesure ajusté à chaque analyse" },
  { text: "Recommandations personnalisées" },
  {
    text: "Recommandations SoftSkin",
    badge: { label: "SoftSkin", variant: "blue" },
  },
  {
    text: "Recommandations IntenseSkin",
    badge: { label: "IntenseSkin", variant: "coral" },
  },
  { text: "Support prioritaire" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId>("annual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePlan = PLANS.find((p) => p.id === selected) ?? PLANS[1];

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });

      if (res.status === 401) {
        router.push("/auth?next=/checkout");
        return;
      }

      const data = await res.json() as { error?: string; url?: string };
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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm mx-auto space-y-8">
        <div className="flex justify-center">
          <Link href="/">
            <span className="inline-flex items-center gap-1.5 select-none">
              <svg width={18} height={18} viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 1L12 8L19 10L12 12L10 19L8 12L1 10L8 8Z" fill="#e8826a" />
                <circle cx="15.5" cy="4.5" r="1.2" fill="#eea593" opacity="0.7" />
              </svg>
              <span className="font-display font-bold italic tracking-tight text-white leading-none text-xl">
                glowy
              </span>
            </span>
          </Link>
        </div>

        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-2xl shadow-black/50 space-y-6">
          <div className="text-center space-y-1.5">
            <h1 className="font-display text-2xl font-bold text-white italic">
              Commence ton Glow Up
            </h1>
            <p className="text-white/50 text-sm leading-relaxed">
              Débloque toutes tes analyses, ta routine complète et le support prioritaire.
            </p>
          </div>

          <div className="relative flex rounded-2xl bg-white/5 p-1 gap-1">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={[
                  "relative flex-1 rounded-xl py-2 px-3 text-sm font-medium transition-all duration-200",
                  selected === plan.id
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-white/50 hover:text-white/80",
                ].join(" ")}
              >
                {plan.label}
                {plan.badge && (
                  <span className="ml-1.5 inline-flex items-center rounded-full bg-coral-400/20 border border-coral-400/30 px-1.5 py-0.5 text-[10px] font-semibold text-coral-400">
                    {plan.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="text-center space-y-0.5">
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display text-5xl font-bold text-white">
                {activePlan.price}
              </span>
              <span className="text-white/40 text-sm ml-0.5">€</span>
              <span className="text-white/40 text-sm">{activePlan.period}</span>
            </div>
            {activePlan.detail && (
              <p className="text-white/30 text-xs">{activePlan.detail}</p>
            )}
          </div>

          <div className="space-y-3">
            {FEATURES.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-coral-400/15">
                  <Check className="h-3 w-3 text-coral-400" />
                </div>
                <span className="text-white/75 text-sm leading-snug flex-1">
                  {feature.text}
                </span>
                {feature.badge && (
                  <span
                    className={[
                      "shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                      feature.badge.variant === "blue"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : "bg-coral-400/20 text-coral-300 border-coral-400/30",
                    ].join(" ")}
                  >
                    {feature.badge.label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-1">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full h-12 rounded-full bg-white text-zinc-900 font-semibold text-sm hover:bg-white/90 active:bg-white/80 transition-colors duration-150 disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Commencer 7 jours gratuits"
              )}
            </button>

            <p className="text-center text-xs text-white/30 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              Paiement sécurisé via Stripe · Sans engagement
            </p>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs">
          En continuant, tu acceptes nos{" "}
          <Link href="/legal" className="underline underline-offset-2 hover:text-white/40 transition-colors">
            conditions d&apos;utilisation
          </Link>
        </p>
      </div>
    </div>
  );
}
