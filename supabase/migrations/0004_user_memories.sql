-- Mémoire persistante du coach : faits structurés extraits des entrées

create table public.user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in (
    'objectif', 'personne', 'habitude', 'theme', 'evenement',
    'preoccupation', 'reussite', 'valeur', 'interet', 'projet', 'difficulte'
  )),
  content text not null,
  occurrences int not null default 1,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index user_memories_user_seen_idx
  on public.user_memories (user_id, last_seen_at desc);

alter table public.user_memories enable row level security;

create policy "memories_select_own" on public.user_memories
  for select using (auth.uid() = user_id);
create policy "memories_insert_own" on public.user_memories
  for insert with check (auth.uid() = user_id);
create policy "memories_update_own" on public.user_memories
  for update using (auth.uid() = user_id);
create policy "memories_delete_own" on public.user_memories
  for delete using (auth.uid() = user_id);
