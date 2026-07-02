/**
 * Script de setup Stripe pour Ancrage — idempotent.
 * Usage : STRIPE_SECRET_KEY=sk_... node scripts/setup-stripe.mjs
 *
 * Cherche le produit + les prix existants avant de créer,
 * puis affiche les variables à copier dans Vercel / .env.local
 */

import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("❌  STRIPE_SECRET_KEY manquante.");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });

// ─── Produit (idempotent) ─────────────────────────────────────────────────────
let product;
const existing = await stripe.products.search({ query: 'metadata["app"]:"ancrage"', limit: 1 });
if (existing.data.length) {
  product = existing.data[0];
  console.log(`✅  Produit existant : ${product.id} (${product.name})`);
} else {
  product = await stripe.products.create({
    name: "Ancrage — Journaling illimité",
    description: "Entrées illimitées, bilans hebdomadaires, mémoire des sessions.",
    metadata: { app: "ancrage" },
  });
  console.log(`✅  Produit créé : ${product.id} (${product.name})`);
}

// ─── Prix (idempotent via lookup_key) ─────────────────────────────────────────
async function upsertPrice(productId, amount, interval, lookupKey, label) {
  const found = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (found.data.length) {
    console.log(`✅  Prix ${label} existant : ${found.data[0].id}`);
    return found.data[0];
  }
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: amount,
    currency: "eur",
    recurring: { interval },
    nickname: label,
    lookup_key: lookupKey,
    metadata: { app: "ancrage", plan: lookupKey },
  });
  console.log(`✅  Prix ${label} créé : ${price.id}`);
  return price;
}

const weekly  = await upsertPrice(product.id, 499,  "week",  "ancrage_weekly",      "Hebdomadaire");
const monthly = await upsertPrice(product.id, 999,  "month", "ancrage_monthly_999", "Mensuel");
const annual  = await upsertPrice(product.id, 4999, "year",  "ancrage_annual",      "Annuel");

// ─── Résumé ───────────────────────────────────────────────────────────────────
console.log("---STRIPE_PRICES---");
console.log(`STRIPE_PRICE_ID_WEEKLY=${weekly.id}`);
console.log(`STRIPE_PRICE_ID_MONTHLY=${monthly.id}`);
console.log(`STRIPE_PRICE_ID_ANNUAL=${annual.id}`);
console.log(`NEXT_PUBLIC_STRIPE_PRICE_WEEKLY=${weekly.id}`);
console.log(`NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=${monthly.id}`);
console.log(`NEXT_PUBLIC_STRIPE_PRICE_ANNUAL=${annual.id}`);
console.log("---END---");
