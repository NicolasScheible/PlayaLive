-- events + event_artists: Veranstaltungen an einer Location und deren n:m-Zuordnung zu Artists.
-- Felder gemäß docs/PRD.md Kapitel 16 (Tabellen `events`, `event_artists`) und docs/Database.md 2.5/2.6.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  title text not null,
  description text,
  start_time timestamptz not null,
  end_time timestamptz,
  image_url text,
  is_sponsored boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint events_end_after_start check (end_time is null or end_time > start_time)
);

create index events_location_id_idx on public.events (location_id) where deleted_at is null;
create index events_start_time_idx on public.events (start_time) where deleted_at is null;

create trigger set_events_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

-- is_location_manager_of(location_id): true, wenn der angemeldete Nutzer Location Manager der
-- übergebenen Location ist (docs/PRD.md Kapitel 15: „Location Manager: ... deren Events ... verwalten").
create or replace function public.is_location_manager_of(target_location_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.locations
    where id = target_location_id
      and owner_user_id = auth.uid()
  ) and public.current_user_role() = 'location_manager';
$$;

alter table public.events enable row level security;

create policy "events_select_active_or_admin"
  on public.events for select
  to authenticated
  using (deleted_at is null or public.is_admin());

create policy "events_insert_admin_or_location_manager"
  on public.events for insert
  to authenticated
  with check (public.is_admin() or public.is_location_manager_of(location_id));

create policy "events_update_admin_or_location_manager"
  on public.events for update
  to authenticated
  using (public.is_admin() or public.is_location_manager_of(location_id))
  with check (public.is_admin() or public.is_location_manager_of(location_id));

create policy "events_delete_super_admin"
  on public.events for delete
  to authenticated
  using (public.current_user_role() = 'super_admin');

create table public.event_artists (
  event_id uuid not null references public.events (id) on delete cascade,
  artist_id uuid not null references public.artists (id) on delete cascade,
  primary key (event_id, artist_id)
);

create index event_artists_artist_id_idx on public.event_artists (artist_id);

alter table public.event_artists enable row level security;

create policy "event_artists_select_all"
  on public.event_artists for select
  to authenticated
  using (true);

create policy "event_artists_insert_admin_or_location_manager"
  on public.event_artists for insert
  to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1 from public.events
      where events.id = event_id
        and public.is_location_manager_of(events.location_id)
    )
  );

create policy "event_artists_delete_admin_or_location_manager"
  on public.event_artists for delete
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.events
      where events.id = event_id
        and public.is_location_manager_of(events.location_id)
    )
  );
