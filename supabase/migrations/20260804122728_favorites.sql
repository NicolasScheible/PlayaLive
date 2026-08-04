-- favorites: zentrale polymorphe Tabelle für gespeicherte Locations/Artists/Events (docs/PRD.md
-- Kapitel 16 „Favoriten-Modell", docs/Database.md 2.9). Da polymorphe Beziehungen keine klassischen
-- Fremdschlüssel erlauben, prüft ein Trigger vor dem Speichern: Existiert die Zielressource (und ist
-- sie nicht gelöscht)? Ein Unique-Constraint verhindert doppelte Favoriten.

create type public.favorite_target_type as enum ('location', 'artist', 'event');

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  target_type public.favorite_target_type not null,
  target_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

create index favorites_user_id_target_type_idx on public.favorites (user_id, target_type);
create index favorites_target_idx on public.favorites (target_type, target_id);

create trigger set_favorites_updated_at
  before update on public.favorites
  for each row
  execute function public.set_updated_at();

-- validate_favorite_target(): prüft „Existiert die Zielressource?" gemäß docs/Database.md 2.9, da
-- `target_id` mangels klassischem Fremdschlüssel sonst auf beliebige, auch nicht existierende oder
-- gelöschte Datensätze verweisen könnte.
create or replace function public.validate_favorite_target()
returns trigger
language plpgsql
stable
as $$
begin
  -- Präfix FAVORITE_INVALID_TARGET analog zu REPORT_RATE_LIMITED/REPORT_GEOFENCE_TOO_FAR
  -- (siehe 20260804122730_reports.sql): Postgres liefert für RAISE EXCEPTION sonst nur die generische
  -- SQLSTATE P0001, ohne die eigentliche Ursache im Fehlercode auszudrücken.
  if new.target_type = 'location' then
    if not exists (select 1 from public.locations where id = new.target_id and deleted_at is null) then
      raise exception 'FAVORITE_INVALID_TARGET: Location % existiert nicht oder ist gelöscht.', new.target_id;
    end if;
  elsif new.target_type = 'artist' then
    if not exists (select 1 from public.artists where id = new.target_id and deleted_at is null) then
      raise exception 'FAVORITE_INVALID_TARGET: Artist % existiert nicht oder ist gelöscht.', new.target_id;
    end if;
  elsif new.target_type = 'event' then
    if not exists (select 1 from public.events where id = new.target_id and deleted_at is null) then
      raise exception 'FAVORITE_INVALID_TARGET: Event % existiert nicht oder ist gelöscht.', new.target_id;
    end if;
  end if;

  return new;
end;
$$;

create trigger validate_favorite_target_before_insert
  before insert on public.favorites
  for each row
  execute function public.validate_favorite_target();

alter table public.favorites enable row level security;

create policy "favorites_select_own"
  on public.favorites for select
  to authenticated
  using (user_id = auth.uid());

create policy "favorites_insert_own"
  on public.favorites for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "favorites_delete_own"
  on public.favorites for delete
  to authenticated
  using (user_id = auth.uid());
