/**
 * Script de setup Stripe pour Ancrage.
 * Usage : STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe.mjs
 *
 * Crée le produit + les deux plans (hebdomadaire et mensuel) en mode test,
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

console.log("🔧  Création du produit Ancrage sur Stripe…\n");

// ─── Produit ─────────────────────────────────────────────────────────────────
const product = await stripe.products.create({
  name: "Ancrage — Journaling illimité",
  description: "Entrées de journal illimitées, bilans hebdomadaires, et mémoire des sessions précédentes.",
  metadata: { app: "ancrage" },
});
console.log(`✅  Produit créé : ${product.id} (${product.name})`);

// ─── Plan hebdomadaire (4,99 € / semaine) ────────────────────────────────────
const weekly = await stripe.prices.create({
  product: product.id,
  unit_amount: 499,           // centimes
  currency: "eur",
  recurring: { interval: "week" },
  nickname: "Hebdomadaire",
  metadata: { app: "ancrage", plan: "weekly" },
});
console.log(`✅  Prix hebdomadaire créé : ${weekly.id}  (4,99 €/semaine)`);

// ─── Plan mensuel (14,99 € / mois) ───────────────────────────────────────────
const monthly = await stripe.prices.create({
  product: product.id,
  unit_amount: 1499,          // centimes
  currency: "eur",
  recurring: { interval: "month" },
  nickname: "Mensuel",
  metadata: { app: "ancrage", plan: "monthly" },
});
console.log(`✅  Prix mensuel créé      : ${monthly.id}  (14,99 €/mois ≈ 3,46 €/semaine)\n`);

// ─── Résumé ───────────────────────────────────────────────────────────────────
console.log("─".repeat(60));
console.log("Colle ces lignes dans ton .env.local :\n");
console.log(`STRIPE_PRICE_ID_WEEKLY=${weekly.id}`);
console.log(`STRIPE_PRICE_ID_MONTHLY=${monthly.id}`);
console.log(`NEXT_PUBLIC_STRIPE_PRICE_WEEKLY=${weekly.id}`);
console.log(`NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=${monthly.id}`);
console.log();
console.log("─".repeat(60));
console.log("Ensuite configure le webhook Stripe :");
console.log("  Dashboard → Developers → Webhooks → Add endpoint");
console.log("  URL : https://TON_DOMAINE/api/webhooks/stripe");
console.log("  Events : checkout.session.completed");
console.log("           customer.subscription.created");
console.log("           customer.subscription.updated");
console.log("           customer.subscription.deleted");
console.log("           invoice.payment_failed");
console.log();
console.log("  Pour tester en local :");
console.log("  stripe listen --forward-to localhost:3000/api/webhooks/stripe");
console.log("  → Copie le whsec_... dans STRIPE_WEBHOOK_SECRET");
console.log("─".repeat(60));
