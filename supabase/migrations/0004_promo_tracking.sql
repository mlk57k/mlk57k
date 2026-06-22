-- Trace quel code promo a été utilisé par chaque profil
alter table public.profiles
  add column if not exists promo_code_used text;
