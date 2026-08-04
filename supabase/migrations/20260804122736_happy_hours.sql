-- happy_hours: regelmäßig wiederkehrende Angebote einer Location, bewusst getrennt von `specials`
-- modelliert (docs/Database.md 2.8: wochentagsbasiert statt an ein festes Datum gebunden). Teil des
-- MVP-Umfangs Version 1.0 (docs/PRD.md Kapitel 7 „Happy Hours & Specials").
-- RLS/Rollen analog zu `specials`/`events`.
--
-- 🔴 Annahme, zur Bestätigung durch den Product Owner vorgelegt: docs/Database.md 2.8 benennt nur
-- „Wochentag" ohne konkreten Typ/Wertebereich — hier als Enum mit den sieben Wochentagen (englische,
-- technische Werte, analog zu `trust_level`/`occupancy_level`) umgesetzt statt als freier Text, da es
-- sich um einen klar begrenzten Wertebereich handelt.
create type public.weekday as enum (
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
);

create table public.happy_hours (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  title text not null,
  description text,
  weekday public.weekday not null,
  start_time time not null,
  end_time time not null,
  offer_text text,
  is_sponsored boolean not null default false,
  priority integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint happy_hours_end_after_start check (end_time > start_time)
);

create index happy_hours_location_id_idx on public.happy_hours (location_id) where is_active;
create index happy_hours_weekday_idx on public.happy_hours (weekday) where is_active;

create trigger set_happy_hours_updated_at
  before update on public.happy_hours
  for each row
  execute function public.set_updated_at();

alter table public.happy_hours enable row level security;

create policy "happy_hours_select_active_or_admin"
  on public.happy_hours for select
  to authenticated
  using (is_active or public.is_admin());

create policy "happy_hours_insert_admin_or_location_manager"
  on public.happy_hours for insert
  to authenticated
  with check (public.is_admin() or public.is_location_manager_of(location_id));

create policy "happy_hours_update_admin_or_location_manager"
  on public.happy_hours for update
  to authenticated
  using (public.is_admin() or public.is_location_manager_of(location_id))
  with check (public.is_admin() or public.is_location_manager_of(location_id));

create policy "happy_hours_delete_super_admin"
  on public.happy_hours for delete
  to authenticated
  using (public.current_user_role() = 'super_admin');
