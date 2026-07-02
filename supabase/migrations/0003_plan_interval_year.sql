-- Autorise l'intervalle annuel pour l'abonnement

alter table public.profiles drop constraint if exists profiles_plan_interval_check;
alter table public.profiles add constraint profiles_plan_interval_check
  check (plan_interval in ('week', 'month', 'year'));
