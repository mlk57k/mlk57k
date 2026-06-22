-- Accès à vie via code promo (ex : "beessap")
-- Seul le service role (webhook / API promo) peut mettre ce flag à true.
alter table public.profiles
  add column if not exists lifetime_access boolean not null default false;
