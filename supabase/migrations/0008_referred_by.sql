-- Tracking influenceurs : code de parrainage (?ref=) collé au profil à
-- l'inscription. Permet de mesurer inscrits / paywall / conversions par source.
alter table public.profiles add column if not exists referred_by text;
create index if not exists profiles_referred_by_idx on public.profiles (referred_by);
