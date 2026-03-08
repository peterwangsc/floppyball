create table if not exists public.floppyball_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null check (char_length(trim(player_name)) between 1 and 18),
  score integer not null check (score >= 0),
  created_at timestamptz not null default now()
);

create index if not exists floppyball_scores_score_created_at_idx
  on public.floppyball_scores (score desc, created_at asc);

alter table public.floppyball_scores enable row level security;

grant select, insert on table public.floppyball_scores to anon;
grant select, insert on table public.floppyball_scores to authenticated;

drop policy if exists "floppyball_scores_select_all" on public.floppyball_scores;
create policy "floppyball_scores_select_all"
  on public.floppyball_scores
  for select
  using (true);

drop policy if exists "floppyball_scores_insert_all" on public.floppyball_scores;
create policy "floppyball_scores_insert_all"
  on public.floppyball_scores
  for insert
  with check (true);
