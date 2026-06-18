-- ─────────────────────────────────────────────────────────────────────────────
-- Glowy — schéma initial : profiles + scans + RLS
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Un user ne lit / modifie que son propre profil.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── scans ───────────────────────────────────────────────────────────────────
create table if not exists public.scans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete cascade,
  skin_score integer not null,
  skin_age   integer not null,
  issues     jsonb   not null default '[]'::jsonb,
  routine    jsonb   not null default '[]'::jsonb,
  unlocked   boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;

-- RLS : un user ne voit / crée / modifie que ses propres scans.
create policy "scans_select_own"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "scans_insert_own"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "scans_update_own"
  on public.scans for update
  using (auth.uid() = user_id);

-- ─── Création automatique du profil au signup ────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
