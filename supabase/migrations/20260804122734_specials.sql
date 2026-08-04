-- specials: zeitlich begrenzte Aktionen/Angebote einer Location (docs/PRD.md Kapitel 16, Kapitel 7
-- „Happy Hours & Specials" ist Teil des MVP-Umfangs Version 1.0; docs/Database.md 2.7).
-- RLS/Rollen analog zu events (docs/PRD.md Kapitel 15: Location Manager verwaltet „ausschließlich die
-- eigene verifizierte Location, deren Events, Specials, Happy Hours").
--
-- 🔴 Annahme, zur Bestätigung durch den Product Owner vorgelegt: `category` ist in docs/Database.md
-- 2.7 nur als „Kategorie" ohne konkrete Werte benannt (anders als z. B. `occupancy_level`) — daher
-- als freier Text umgesetzt, analog zu `artists.genres`/`reports.music_genre`.

create table public.specials (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations (id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  category text,
  start_date date not null,
  end_date date,
  start_time time,
  end_time time,
  is_recurring boolean not null default false,
  is_sponsored boolean not null default false,
  priority integer not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint specials_end_date_after_start check (end_date is null or end_date >= start_date)
);

create index specials_location_id_idx on public.specials (location_id) where is_active;
create index specials_start_date_idx on public.specials (start_date) where is_active;

create trigger set_specials_updated_at
  before update on public.specials
  for each row
  execute function public.set_updated_at();

alter table public.specials enable row level security;

create policy "specials_select_active_or_admin"
  on public.specials for select
  to authenticated
  using (is_active or public.is_admin());

create policy "specials_insert_admin_or_location_manager"
  on public.specials for insert
  to authenticated
  with check (public.is_admin() or public.is_location_manager_of(location_id));

create policy "specials_update_admin_or_location_manager"
  on public.specials for update
  to authenticated
  using (public.is_admin() or public.is_location_manager_of(location_id))
  with check (public.is_admin() or public.is_location_manager_of(location_id));

create policy "specials_delete_super_admin"
  on public.specials for delete
  to authenticated
  using (public.current_user_role() = 'super_admin');

-- Storage-Policy-Nachtrag: der `specials`-Bucket (20260804122732_storage_buckets.sql) beschränkte
-- Schreibrechte vorerst auf Admin/Super Admin, da diese Tabelle dort noch nicht existierte. Jetzt
-- Location-Manager-Schreibrecht für die eigene Location ergänzt, analog zu `events`
-- (docs/PRD.md Kapitel 15 „Storage-Buckets": „Location Manager (eigene Location)").
drop policy "storage_specials_write_admin" on storage.objects;

create policy "storage_specials_write_admin_or_owner"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'specials'
    and (
      public.is_admin()
      or exists (
        select 1 from public.specials
        where specials.id = ((storage.foldername(name))[1])::uuid
          and public.is_location_manager_of(specials.location_id)
      )
    )
  )
  with check (
    bucket_id = 'specials'
    and (
      public.is_admin()
      or exists (
        select 1 from public.specials
        where specials.id = ((storage.foldername(name))[1])::uuid
          and public.is_location_manager_of(specials.location_id)
      )
    )
  );
