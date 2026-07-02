"use client";

import { useState } from "react";
import Link from "next/link";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type Plan = "weekly" | "annual" | "monthly";

const CTA_LABELS: Record<Plan, string> = {
  weekly: "Commencer — 4,99 €/sem",
  annual: "Commencer — 49,99 €/an",
  monthly: "Commencer — 9,99 €/mois",
};

const BENEFITS = [
  "Entrées illimitées, écrites ou vocales",
  "Ton IA se souvient de tout et repère tes patterns",
  "Résumé de ta semaine chaque dimanche",
  "Tes données exportables à tout moment, en un clic",
];

export default function PaywallPage() {
  const [selected, setSelected] = useState<Plan>("annual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Erreur lors du paiement.");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du paiement.");
      setLoading(false);
    }
  }

  function selectOn(plan: Plan) {
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

  return (
    <div className={`pw-root ${outfit.className}`}>
      <style>{`
        .pw-root {
          --encre: #141220;
          --encre-2: #1d1a2e;
          --papier: #f6f2ea;
          --plume: #efeaf6;
          --plume-dim: #9d95b8;
          --halo: #e8a87c;
          --halo-deep: #d98d5f;
          --sur-halo: #3a2415;

          min-height: 100vh;
          background: var(--encre);
          color: var(--plume);
          position: relative;
        }
        .pw-halo {
          position: absolute;
          top: -120px; left: 50%;
          transform: translateX(-50%);
          width: 560px; height: 420px;
          background: radial-gradient(closest-side, rgba(232,168,124,.16), transparent);
          pointer-events: none;
        }
        .pw-wrap {
          position: relative;
          max-width: 430px;
          margin: 0 auto;
          padding: 20px 20px 160px;
        }
        .pw-close {
          position: absolute;
          top: 16px; right: 16px;
          width: 34px; height: 34px;
          border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(239,234,246,.07);
          color: var(--plume-dim);
          font-size: 15px;
          transition: background .15s;
        }
        .pw-close:hover { background: rgba(239,234,246,.14); }
        .pw-h1 {
          font-family: var(--font-display), Georgia, serif;
          font-weight: 600;
          font-size: 30px;
          line-height: 1.15;
          margin: 52px 0 10px;
          letter-spacing: -0.01em;
        }
        .pw-h1 em { font-style: italic; color: var(--halo); }
        .pw-sub {
          color: var(--plume-dim);
          font-size: 15px;
          line-height: 1.5;
          margin-bottom: 22px;
        }
        .pw-benefits { display: flex; flex-direction: column; gap: 9px; margin-bottom: 26px; }
        .pw-benefit { display: flex; gap: 10px; font-size: 14.5px; line-height: 1.4; }
        .pw-benefit span:first-child { color: var(--halo); flex: none; }

        .pw-cards { display: flex; flex-direction: column; gap: 12px; }
        .pw-card {
          border-radius: 18px;
          padding: 15px 16px;
          cursor: pointer;
          border: 2px solid transparent;
          display: flex; align-items: center; gap: 12px;
          transition: border-color .15s;
          -webkit-tap-highlight-color: transparent;
        }
        .pw-card:focus-visible { outline: 3px solid var(--halo); outline-offset: 2px; }
        .pw-card-dark { background: var(--encre-2); }
        .pw-card-dark[aria-checked="true"] { border-color: var(--halo); }
        .pw-card-papier {
          background: var(--papier);
          color: #2a2333;
          border-color: rgba(217,141,95,.35);
        }
        .pw-card-papier[aria-checked="true"] { border-color: var(--halo-deep); }
        @media (prefers-reduced-motion: no-preference) {
          .pw-card-papier { animation: pw-breathe 3.2s ease-in-out infinite; }
          @keyframes pw-breathe {
            0%, 100% { box-shadow: 0 4px 24px rgba(232,168,124,.18); }
            50%      { box-shadow: 0 6px 38px rgba(232,168,124,.38); }
          }
        }
        .pw-radio {
          width: 20px; height: 20px; border-radius: 999px;
          border: 2px solid var(--plume-dim);
          flex: none;
          display: flex; align-items: center; justify-content: center;
        }
        .pw-card-papier .pw-radio { border-color: rgba(58,36,21,.4); }
        [aria-checked="true"] .pw-radio { border-color: var(--halo-deep); }
        [aria-checked="true"] .pw-radio::after {
          content: ""; width: 10px; height: 10px; border-radius: 999px;
          background: var(--halo);
        }
        .pw-card-body { flex: 1; min-width: 0; }
        .pw-plan-name { font-weight: 600; font-size: 14px; }
        .pw-card-dark .pw-plan-name { color: var(--plume); }
        .pw-price { font-weight: 700; font-size: 19px; margin-top: 1px; }
        .pw-price-note { font-size: 12px; color: var(--plume-dim); margin-top: 1px; }
        .pw-card-papier .pw-price-note { color: rgba(42,35,51,.55); }

        .pw-badge-top {
          display: inline-block;
          background: var(--halo);
          color: var(--sur-halo);
          font-size: 11px; font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 999px;
          margin: 6px 0 -4px 16px;
        }
        .pw-strike-row { display: flex; align-items: center; gap: 8px; }
        .pw-strike { text-decoration: line-through; color: rgba(42,35,51,.45); font-size: 13px; }
        .pw-discount {
          background: var(--halo);
          color: var(--sur-halo);
          font-size: 11px; font-weight: 700;
          padding: 2px 8px; border-radius: 999px;
        }
        .pw-daily {
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: 13px;
          color: var(--halo-deep);
          margin-top: 2px;
        }
        .pw-monthly-eq {
          font-size: 12.5px;
          color: rgba(42,35,51,.6);
          text-align: right;
          flex: none;
          align-self: center;
        }

        .pw-anchor {
          text-align: center;
          color: var(--plume-dim);
          font-size: 13.5px;
          line-height: 1.55;
          margin: 24px 8px 0;
        }

        .pw-cta-zone {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          padding: 40px 20px calc(16px + env(safe-area-inset-bottom));
          background: linear-gradient(to top, var(--encre) 62%, transparent);
          display: flex; flex-direction: column; align-items: center;
        }
        .pw-cta-inner { width: 100%; max-width: 390px; }
        .pw-cta {
          width: 100%;
          background: var(--halo);
          color: var(--sur-halo);
          font-weight: 700;
          font-size: 16px;
          padding: 16px;
          border-radius: 16px;
          transition: background .15s, transform .1s;
        }
        .pw-cta:hover { background: var(--halo-deep); }
        .pw-cta:active { transform: scale(.985); }
        .pw-cta:disabled { opacity: .6; }
        .pw-cta:focus-visible { outline: 3px solid var(--plume); outline-offset: 2px; }
        .pw-legal {
          text-align: center;
          font-size: 11.5px;
          color: var(--plume-dim);
          margin-top: 10px;
          line-height: 1.5;
        }
        .pw-legal a { text-decoration: underline; }
        .pw-error { color: #f2b8a0; font-size: 13px; text-align: center; margin-top: 8px; }
      `}</style>

      <div className="pw-halo" />

      <div className="pw-wrap">
        <Link href="/journal" aria-label="Fermer" className="pw-close">✕</Link>

        <h1 className="pw-h1">
          Continue d&apos;écrire, sans <em>limite</em>
        </h1>
        <p className="pw-sub">
          Tu as utilisé tes 3 entrées gratuites de la semaine. Passe en illimité pour ne rien
          perdre de ton élan.
        </p>

        <div className="pw-benefits">
          {BENEFITS.map((b) => (
            <div key={b} className="pw-benefit">
              <span>✦</span>
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div role="radiogroup" aria-label="Formules d'abonnement" className="pw-cards">
          {/* Hebdomadaire — repoussoir */}
          <div className="pw-card pw-card-dark" {...selectOn("weekly")}>
            <span className="pw-radio" />
            <div className="pw-card-body">
              <p className="pw-plan-name">Hebdomadaire</p>
              <p className="pw-price">4,99 €</p>
              <p className="pw-price-note">par semaine · ~20 €/mois</p>
            </div>
          </div>

          {/* Annuel — le héros */}
          <div>
            <span className="pw-badge-top">Le plus choisi</span>
            <div className="pw-card pw-card-papier" {...selectOn("annual")}>
              <span className="pw-radio" />
              <div className="pw-card-body">
                <p className="pw-plan-name">Annuel</p>
                <div className="pw-strike-row">
                  <span className="pw-strike">119,88 €</span>
                  <span className="pw-discount">−58 %</span>
                </div>
                <p className="pw-price">49,99 €</p>
                <p className="pw-daily">soit 0,14 € par jour</p>
              </div>
              <span className="pw-monthly-eq">≈ 4,17 €/mois</span>
            </div>
          </div>

          {/* Mensuel — référence */}
          <div className="pw-card pw-card-dark" {...selectOn("monthly")}>
            <span className="pw-radio" />
            <div className="pw-card-body">
              <p className="pw-plan-name">Mensuel</p>
              <p className="pw-price">9,99 €</p>
              <p className="pw-price-note">par mois</p>
            </div>
          </div>
        </div>

        <p className="pw-anchor">
          Une séance chez un psychologue : 60 à 80 €.<br />
          Un an d&apos;espace pour poser tes pensées : 49,99 €.
        </p>
      </div>

      <div className="pw-cta-zone">
        <div className="pw-cta-inner">
          <button className="pw-cta" disabled={loading} onClick={checkout}>
            {loading ? "Redirection…" : CTA_LABELS[selected]}
          </button>
          {error && <p className="pw-error">{error}</p>}
          <p className="pw-legal">
            Annulable en 1 clic depuis ton compte · Aucun prélèvement caché
            <br />
            <Link href="/terms">Conditions</Link> · <Link href="/privacy">Confidentialité</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
