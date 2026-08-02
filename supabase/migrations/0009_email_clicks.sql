-- Pistage des clics email (maison) : chaque clic sur un lien /r/<campagne>
-- enregistre qui a cliqué et quand. Permet de mesurer l'engagement réel.
create table if not exists public.email_clicks (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  campaign text not null,
  clicked_at timestamptz not null default now()
);
create index if not exists email_clicks_campaign_idx on public.email_clicks (campaign, clicked_at desc);
