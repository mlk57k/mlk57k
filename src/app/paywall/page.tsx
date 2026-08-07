"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Check, Sparkles } from "lucide-react";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";

type Plan = "weekly" | "annual" | "monthly";

const CTA_LABELS: Record<Plan, string> = {
  weekly: "Commencer — 4,99 €/sem",
  annual: "Commencer — 49,99 €/an",
  monthly: "Commencer — 1er mois à 1 €",
};

const BENEFITS = [
  "Confidences illimitées avec ton coach",
  "Analyse IA de tes tendances et patterns",
  "Historique complet de ton journal",
  "Ton mois en humeurs, jour par jour",
  "Pauses respiration guidées",
  "Résumé de ta semaine chaque dimanche",
];

export default function PaywallPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Plan>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const { data: { user } } = await createClient().auth.getUser();
      if (!user) {
        router.replace("/auth?next=/paywall");
        return;
      }
      // Étape 1 du funnel : le paywall est réellement vu par un compte connecté.
      track("paywall_viewed");
    })();
  }, [router]);

  async function checkout() {
    setLoading(true);
    setError(null);
    // Étape 2 : l'utilisateur a cliqué « Commencer » pour le plan choisi.
    track("paywall_checkout_click", { plan: selected });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erreur lors du paiement.");
      // Étape 3 : Stripe a bien créé la session, on redirige vers la page de paiement.
      track("paywall_reached_stripe", { plan: selected });
      window.location.assign(data.url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du paiement.";
      // Échec avant d'atteindre Stripe (route / config) : on le trace pour le voir.
      track("paywall_checkout_error", { plan: selected, message });
      setError(message);
      setLoading(false);
    }
  }

  function planProps(plan: Plan) {
    return {
      role: "radio" as const,
      "aria-checked": selected === plan,
      tabIndex: 0,
      onClick: () => setSelected(plan),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelected(plan);
        }
      },
    };
  }

  const Radio = ({ active }: { active: boolean }) => (
    <span
      className={cn(
        "flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 transition-colors",
        active ? "border-coral-400 bg-coral-400" : "border-cream-300 bg-transparent"
      )}
    >
      {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
    </span>
  );

  const ApplePayMark = () => (
    <span className="inline-flex items-center gap-1 rounded-md border border-cream-300 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-stone-700">
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
        <path d="M11.05 8.53c-.02-1.5 1.22-2.22 1.28-2.26-.7-1.02-1.78-1.16-2.17-1.18-.92-.09-1.8.54-2.27.54-.47 0-1.19-.53-1.96-.51-1 .01-1.94.59-2.46 1.49-1.05 1.82-.27 4.51.76 5.99.5.72 1.1 1.53 1.88 1.5.76-.03 1.05-.49 1.96-.49.91 0 1.17.49 1.97.47.81-.01 1.33-.73 1.83-1.46.58-.84.82-1.65.83-1.69-.02-.01-1.59-.61-1.61-2.42zM9.62 4.2c.42-.5.7-1.2.62-1.9-.6.02-1.33.4-1.76.9-.39.44-.73 1.15-.64 1.83.67.05 1.36-.34 1.78-.83z"/>
      </svg>
      Pay
    </span>
  );
  const GooglePayMark = () => (
    <span className="inline-flex items-center gap-1 rounded-md border border-cream-300 bg-white px-1.5 py-0.5 text-[11px] font-semibold text-stone-700">
      <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden>
        <path fill="#4285F4" d="M23 12.25c0-.79-.07-1.54-.2-2.25H12v4.26h6.16a5.27 5.27 0 0 1-2.28 3.46v2.87h3.69C21.7 18.6 23 15.7 23 12.25z"/>
        <path fill="#34A853" d="M12 24c3.08 0 5.66-1.02 7.55-2.77l-3.69-2.87c-1.02.69-2.33 1.1-3.86 1.1-2.97 0-5.48-2-6.38-4.7H1.7v2.96A11.4 11.4 0 0 0 12 24z"/>
        <path fill="#FBBC05" d="M5.62 14.76A6.86 6.86 0 0 1 5.62 9.24V6.28H1.7a11.4 11.4 0 0 0 0 11.44l3.92-2.96z"/>
        <path fill="#EA4335" d="M12 4.75c1.67 0 3.17.57 4.35 1.7l3.26-3.26C17.66 1.2 15.08 0 12 0 7.5 0 3.62 2.58 1.7 6.28l3.92 2.96C6.52 6.75 9.03 4.75 12 4.75z"/>
      </svg>
      Pay
    </span>
  );

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Halo doux en haut, façon lampe de chevet */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72"
        style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(189,110,76,0.10), transparent)" }}
      />

      <div className="relative mx-auto max-w-md px-5 pb-40 pt-6">
        <div className="flex justify-end">
          <Link
            href="/journal"
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-stone-400 transition-colors hover:text-stone-600"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        <h1 className="font-display text-[2rem] font-semibold leading-tight text-stone-900">
          Continue d&apos;écrire,<br />sans <span className="italic text-coral-500">limite</span>
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-500">
          Tu as utilisé tes 10 confidences offertes. Passe en illimité pour continuer à
          déposer tes soirs, sans jamais t&apos;arrêter.
        </p>

        <ul className="mt-6 space-y-2.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-stone-700">
              <Sparkles className="mt-0.5 h-4 w-4 flex-none text-coral-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div role="radiogroup" aria-label="Formules d'abonnement" className="mt-7 space-y-3">
          {/* Hebdomadaire — repoussoir */}
          <div
            {...planProps("weekly")}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400",
              selected === "weekly" ? "border-coral-400 shadow-soft" : "border-cream-200"
            )}
          >
            <Radio active={selected === "weekly"} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-800">Hebdomadaire</p>
              <p className="text-lg font-bold text-stone-900">4,99 €</p>
              <p className="text-xs text-stone-400">par semaine · ~20 €/mois</p>
            </div>
          </div>

          {/* Annuel — le héros */}
          <div className="relative">
            <span className="absolute -top-2.5 left-4 z-10 rounded-full bg-gradient-coral px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow-coral">
              Le plus choisi
            </span>
            <div
              {...planProps("annual")}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white px-4 pb-4 pt-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 motion-safe:animate-breathe",
                selected === "annual" ? "border-coral-400 shadow-glow-coral" : "border-coral-200 shadow-soft"
              )}
            >
              <Radio active={selected === "annual"} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800">Annuel</p>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-stone-400 line-through">119,88 €</span>
                  <span className="rounded-full bg-coral-500 px-2 py-0.5 text-[10px] font-bold text-white">−58 %</span>
                </div>
                <p className="text-2xl font-bold text-stone-900">49,99 €</p>
                <p className="font-display text-[13px] italic text-coral-500">soit 0,14 € par jour</p>
              </div>
              <span className="self-center text-right text-xs text-stone-400">≈ 4,17 €/mois</span>
            </div>
          </div>

          {/* Mensuel — offre de lancement : 1er mois à 1 € */}
          <div className="relative">
            <span className="absolute -top-2.5 left-4 z-10 rounded-full bg-gradient-coral px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow-coral">
              1er mois à 1 €
            </span>
            <div
              {...planProps("monthly")}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border-2 bg-white px-4 pb-4 pt-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-400",
                selected === "monthly" ? "border-coral-400 shadow-glow-coral" : "border-coral-200 shadow-soft"
              )}
            >
              <Radio active={selected === "monthly"} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800">Mensuel</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-stone-900">1 €</span>
                  <span className="text-xs text-stone-400">le 1er mois</span>
                </div>
                <p className="text-xs text-stone-400">puis 9,99 € / mois · annulable à tout moment</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 px-2 text-center text-[13.5px] leading-relaxed text-stone-400">
          Une séance chez un psychologue : 60 à 80 €.<br />
          Un an d&apos;espace pour poser tes pensées : 49,99 €.
        </p>
      </div>

      {/* CTA fixe en bas avec fondu */}
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-cream-50 from-60% to-transparent px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-10">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={checkout}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-coral py-4 text-base font-bold text-white shadow-glow-coral transition-transform active:scale-[0.985] disabled:opacity-60"
          >
            {loading ? "Redirection…" : CTA_LABELS[selected]}
          </button>
          {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}

          {/* Rassurance paiement : 1 tap avec les wallets, sans saisir de carte */}
          <div className="mt-3 flex items-center justify-center gap-2 text-stone-500">
            <ApplePayMark />
            <GooglePayMark />
            <span className="text-[12px] font-medium">Paye en 1 tap, sans saisir ta carte</span>
          </div>

          <p className="mt-2.5 text-center text-[11.5px] leading-relaxed text-stone-400">
            Annulable en 1 clic depuis ton compte · Aucun prélèvement caché
            <br />
            <Link href="/terms" className="underline">Conditions</Link>
            {" · "}
            <Link href="/privacy" className="underline">Confidentialité</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
