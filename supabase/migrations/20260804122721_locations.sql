-- locations: Clubs/Bars an der Playa de Palma. Felder gemäß docs/PRD.md Kapitel 16 (Tabelle
-- `locations`) und docs/Database.md 2.3. RLS-Rollen gemäß docs/PRD.md Kapitel 15.

create type public.location_category as enum ('club', 'bar');

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category public.location_category not null,
  address text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  -- 🔴 Abweichung von docs/PRD.md Kapitel 16 „keine komplexen JSON-Felder für strukturierte Inhalte":
  -- Öffnungszeiten sind strukturierte Wochentagsdaten, für die kein eigenes Tabellenmodell in der
  -- dokumentierten ER-Übersicht existiert (dort nur als einzelnes Feld `opening_hours` gelistet). Eine
  -- neue, nicht dokumentierte Tabelle wäre eine eigene Architekturentscheidung — daher hier bewusst als
  -- JSONB umgesetzt, zur Bestätigung/Alternative durch den Product Owner vorgelegt.
  opening_hours jsonb,
  images text[] not null default '{}',
  is_sponsored boolean not null default false,
  sponsored_until timestamptz,
  owner_user_id uuid references public.profiles (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on column public.locations.owner_user_id is
  'Location Manager (Rolle ab v2.0, docs/Database.md 2.3) — Spalte bereits Teil des dokumentierten '
  'Schemas, die zugehörige Partner-Verifizierung (Tabelle `partners`) ist nicht Teil dieses Schritts.';

create index locations_category_idx on public.locations (category) where deleted_at is null;
create index locations_coordinates_idx on public.locations (latitude, longitude) where deleted_at is null;
create index locations_owner_user_id_idx on public.locations (owner_user_id) where owner_user_id is not null;

create trigger set_locations_updated_at
  before update on public.locations
  for each row
  execute function public.set_updated_at();

alter table public.locations enable row level security;

-- User: „öffentliche Locations ... lesen" (docs/PRD.md Kapitel 15) — gelöschte Locations bleiben für
-- normale Nutzer unsichtbar, Admin/Super Admin sehen auch diese (z. B. zur Wiederherstellung).
create policy "locations_select_active_or_admin"
  on public.locations for select
  to authenticated
  using (deleted_at is null or public.is_admin());

create policy "locations_insert_admin"
  on public.locations for insert
  to authenticated
  with check (public.is_admin());

-- Admin/Super Admin verwalten alle Locations; Location Manager (v2.0) ausschließlich die eigene
-- verifizierte Location (docs/PRD.md Kapitel 15: „Location Manager: ... ausschließlich die eigene
-- verifizierte Location ... verwalten").
create policy "locations_update_admin_or_owner"
  on public.locations for update
  to authenticated
  using (public.is_admin() or (public.current_user_role() = 'location_manager' and owner_user_id = auth.uid()))
  with check (public.is_admin() or (public.current_user_role() = 'location_manager' and owner_user_id = auth.uid()));

create policy "locations_delete_super_admin"
  on public.locations for delete
  to authenticated
  using (public.current_user_role() = 'super_admin');
