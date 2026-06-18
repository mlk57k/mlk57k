-- Stripe customer ID sur les profils
alter table public.profiles
  add column if not exists stripe_customer_id text;

-- Index pour retrouver un profil depuis un customer_id Stripe (webhook)
create unique index if not exists profiles_stripe_customer_id_idx
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;
