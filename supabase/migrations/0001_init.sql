-- Ancrage — schéma initial : profils, entrées de journal, messages de
-- conversation, bilans hebdomadaires, et journal d'idempotence des
-- webhooks Stripe.

-- ─── profiles ──────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),

  -- Abonnement
  stripe_customer_id text unique,
  stripe_subscription_id text,
  plan_status text not null default 'free'
    check (plan_status in ('free', 'trialing', 'active', 'past_due', 'canceled')),
  plan_interval text check (plan_interval in ('week', 'month')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,

  -- Quota gratuit (3 entrées / semaine)
  free_entries_used int not null default 0,
  free_entries_reset_at timestamptz not null default now(),

  -- Personnalisation / mémoire du coach
  objectifs text,
  memory_digest text,

  -- Rappels
  reminder_enabled boolean not null default true,
  reminder_hour int not null default 20 check (reminder_hour between 0 and 23),
  timezone text not null default 'Europe/Paris'
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-création du profil à l'inscription
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── journal_entries ───────────────────────────────────────────────────────
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  mood_score smallint check (mood_score between 1 and 10),
  content text not null default '',
  is_complete boolean not null default false
);

create index journal_entries_user_id_created_at_idx
  on public.journal_entries (user_id, created_at desc);

alter table public.journal_entries enable row level security;

create policy "entries_select_own" on public.journal_entries
  for select using (auth.uid() = user_id);
create policy "entries_insert_own" on public.journal_entries
  for insert with check (auth.uid() = user_id);
create policy "entries_update_own" on public.journal_entries
  for update using (auth.uid() = user_id);
create policy "entries_delete_own" on public.journal_entries
  for delete using (auth.uid() = user_id);

create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger entries_set_updated_at
  before update on public.journal_entries
  for each row execute function public.set_updated_at();

-- ─── entry_messages (fil de conversation au sein d'une entrée) ────────────
create table public.entry_messages (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.journal_entries(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index entry_messages_entry_id_created_at_idx
  on public.entry_messages (entry_id, created_at asc);

alter table public.entry_messages enable row level security;

create policy "messages_select_own" on public.entry_messages
  for select using (auth.uid() = user_id);
create policy "messages_insert_own" on public.entry_messages
  for insert with check (auth.uid() = user_id);

-- ─── weekly_summaries ──────────────────────────────────────────────────────
create table public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  summary text not null,
  mood_trend jsonb not null default '[]',
  created_at timestamptz not null default now(),
  emailed_at timestamptz,
  unique (user_id, week_start)
);

alter table public.weekly_summaries enable row level security;

create policy "summaries_select_own" on public.weekly_summaries
  for select using (auth.uid() = user_id);

-- ─── stripe_events (idempotence des webhooks) ──────────────────────────────
create table public.stripe_events (
  id text primary key,
  type text not null,
  created_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;
-- Aucune policy : accessible uniquement via la clé service_role (webhook).
