-- Scroll PT: tabela z postępem użytkowników.
-- Uruchom raz w Supabase: SQL Editor → New query → wklej → Run.

create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,   -- cały stan aplikacji: kartoteka słów (srs), XP, streak, ustawienia
  updated_at timestamptz not null default now()
);

-- Dostęp do tabeli dla zalogowanych (nowe projekty Supabase nie nadają go automatycznie).
-- Niezalogowani (rola anon) nie dostają nic.
grant select, insert, update on public.progress to authenticated;

-- Row Level Security: każdy użytkownik widzi i zmienia wyłącznie swój wiersz.
alter table public.progress enable row level security;

drop policy if exists "progress: odczyt własnego" on public.progress;
create policy "progress: odczyt własnego" on public.progress
  for select using (auth.uid() = user_id);

drop policy if exists "progress: dodanie własnego" on public.progress;
create policy "progress: dodanie własnego" on public.progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "progress: zmiana własnego" on public.progress;
create policy "progress: zmiana własnego" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
