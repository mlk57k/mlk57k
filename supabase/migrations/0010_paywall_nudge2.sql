-- 2e relance paywall : horodatage de l'envoi (une seule fois par compte).
alter table public.profiles add column if not exists paywall_nudge2_at timestamptz;

-- Les comptes déjà relancés manuellement (campagne "1 €") sont exclus de la
-- 2e relance automatique immédiate : on marque leur 2e relance comme faite.
-- Les NOUVEAUX bloqués recevront la séquence complète (relance 1 → +3j → relance 2).
update public.profiles
set paywall_nudge2_at = now()
where paywall_notified_at is not null
  and paywall_nudge2_at is null
  and plan_status not in ('active', 'trialing');
