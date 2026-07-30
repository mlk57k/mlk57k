-- Horodatage de l'email de bienvenue (envoyé une seule fois au premier login)
alter table public.profiles add column if not exists welcomed_at timestamptz;
