-- Horodatage de la relance paywall (envoyée une seule fois quand les
-- 10 confidences offertes sont épuisées)
alter table public.profiles add column if not exists paywall_notified_at timestamptz;
