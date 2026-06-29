-- ─────────────────────────────────────────────────────────────────────────────
-- Glowy — cycle de vie de l'abonnement Stripe sur les profils
-- ─────────────────────────────────────────────────────────────────────────────
-- Objectif : suivre l'état réel de l'abonnement pour que l'accès (lifetime_access)
-- soit accordé au paiement ET révoqué à l'annulation, de façon fiable via webhook.

alter table public.profiles
  add column if not exists stripe_subscription_id text;

-- Statut renvoyé par Stripe : active, trialing, past_due, canceled, unpaid, …
-- 'promo' pour un accès accordé par code promo (pas d'abonnement Stripe).
alter table public.profiles
  add column if not exists subscription_status text;

-- Fin de la période payée en cours (pour afficher la date de renouvellement /
-- d'expiration côté dashboard). Null pour un accès promo à vie.
alter table public.profiles
  add column if not exists subscription_current_period_end timestamptz;

-- Retrouver rapidement un profil depuis l'id d'abonnement (webhook).
create index if not exists profiles_stripe_subscription_id_idx
  on public.profiles (stripe_subscription_id)
  where stripe_subscription_id is not null;
