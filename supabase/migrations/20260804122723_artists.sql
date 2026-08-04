-- artists: DJs/Künstler. Felder gemäß docs/PRD.md Kapitel 16 (Tabelle `artists`) und
-- docs/Database.md 2.4. Social-Media-Links als einzelne Spalten (keine JSON-Struktur, siehe
-- docs/PRD.md Kapitel 16 „keine komplexen JSON-Felder") für die in docs/DesignSystem.md Kapitel 10
-- als Icon-Inventar genannten Plattformen (Instagram/Spotify/YouTube/TikTok).

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  image_url text,
  genres text[] not null default '{}',
  instagram_url text,
  spotify_url text,
  youtube_url text,
  tiktok_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index artists_deleted_at_idx on public.artists (deleted_at);

create trigger set_artists_updated_at
  before update on public.artists
  for each row
  execute function public.set_updated_at();

alter table public.artists enable row level security;

create policy "artists_select_active_or_admin"
  on public.artists for select
  to authenticated
  using (deleted_at is null or public.is_admin());

create policy "artists_insert_admin"
  on public.artists for insert
  to authenticated
  with check (public.is_admin());

create policy "artists_update_admin"
  on public.artists for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "artists_delete_super_admin"
  on public.artists for delete
  to authenticated
  using (public.current_user_role() = 'super_admin');
