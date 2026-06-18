/**
 * Script de setup Stripe pour Glowy.
 * Usage : STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe.mjs
 *
 * Crée le produit + les deux plans (mensuel et annuel) en mode test,
 * puis affiche les variables à coller dans .env.local
 */

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("❌  STRIPE_SECRET_KEY manquante.");
  console.error("   Lance : STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe.mjs");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });

console.log("🔧  Création du produit Glowy sur Stripe…\n");

// ─── Produit ─────────────────────────────────────────────────────────────────
const product = await stripe.products.create({
  name: "Glowy — Routine personnalisée",
  description: "Accès à ta routine de soin personnalisée par IA, suivi de score et historique des scans.",
  metadata: { app: "glowy" },
});
console.log(`✅  Produit créé : ${product.id} (${product.name})`);

// ─── Plan mensuel (7,99 € / mois) ────────────────────────────────────────────
const monthly = await stripe.prices.create({
  product: product.id,
  unit_amount: 799,           // centimes
  currency: "eur",
  recurring: { interval: "month" },
  nickname: "Mensuel",
  metadata: { app: "glowy", plan: "monthly" },
});
console.log(`✅  Prix mensuel créé  : ${monthly.id}  (7,99 €/mois)`);

// ─── Plan annuel (39 € / an) ──────────────────────────────────────────────────
const annual = await stripe.prices.create({
  product: product.id,
  unit_amount: 3900,          // centimes
  currency: "eur",
  recurring: { interval: "year" },
  nickname: "Annuel",
  metadata: { app: "glowy", plan: "annual" },
});
console.log(`✅  Prix annuel créé   : ${annual.id}  (39 €/an ≈ 3,25 €/mois)\n`);

// ─── Résumé ───────────────────────────────────────────────────────────────────
console.log("─".repeat(60));
console.log("Colle ces lignes dans ton .env.local :\n");
console.log(`NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=${monthly.id}`);
console.log(`NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=${annual.id}`);
console.log();
console.log("─".repeat(60));
console.log("Ensuite configure le webhook Stripe :");
console.log("  Dashboard → Developers → Webhooks → Add endpoint");
console.log("  URL : https://TON_DOMAINE/api/webhooks/stripe");
console.log("  Events : checkout.session.completed");
console.log("           customer.subscription.created");
console.log("           customer.subscription.updated");
console.log();
console.log("  Pour tester en local :");
console.log("  stripe listen --forward-to localhost:3000/api/webhooks/stripe");
console.log("  → Copie le whsec_... dans STRIPE_WEBHOOK_SECRET");
console.log("─".repeat(60));
