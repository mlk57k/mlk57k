# Ancrage

Compagnon de réflexion quotidienne par IA — journaling guidé (texte ou voix),
mémoire des sessions précédentes, bilans hebdomadaires, suivi d'humeur.
Fondé sur des principes de TCC et d'entretien motivationnel, **sans se
substituer à un suivi thérapeutique**.

## Stack

- Next.js 14 (App Router) + Tailwind CSS
- Supabase (auth + Postgres + RLS)
- Anthropic Claude (coach conversationnel)
- OpenAI Whisper (transcription des notes vocales)
- Stripe (abonnement hebdomadaire / mensuel)
- Resend (emails transactionnels)

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # renseigner les clés
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Voir `.env.example` pour la liste complète (Anthropic, OpenAI, Supabase,
Stripe, Resend, Cron).

## Stripe (dev local)

```bash
node scripts/setup-stripe.mjs
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
