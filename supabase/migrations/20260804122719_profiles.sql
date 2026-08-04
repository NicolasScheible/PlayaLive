-- profiles: erweitert Supabase-Auth-Nutzer um App-spezifische Daten.
-- Felder/Rollen gemäß docs/PRD.md Kapitel 16 (Tabelle `profiles`) und Kapitel 12
-- (Rollenmodell: user/location_manager[v2.x]/admin/super_admin).
-- RLS gemäß docs/PRD.md Kapitel 15 „Row-Level-Security": User sieht/bearbeitet ausschließlich das
-- eigene Profil, keine anderen Nutzer sichtbar.

create type public.user_role as enum ('user', 'location_manager', 'admin', 'super_admin');

-- Vertrauenslevel gemäß docs/PRD.md → „Vertrauenssystem (Trust Score)": der numerische Score ist
-- ausschließlich intern, Nutzer sehen ein verständliches Level. Technische (englische) Werte hier,
-- die deutschen Anzeigetexte („Neues Mitglied" usw.) löst die App auf (vgl. src/lib/errors.ts-Muster
-- messageKey → Text), keine i18n-Bibliothek in diesem Schritt festgelegt.
create type public.trust_level as enum ('new_member', 'trusted', 'experienced', 'top_member');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'user',
  trust_score integer not null default 0 check (trust_score >= 0),
  trust_level public.trust_level not null default 'new_member',
  reports_count integer not null default 0 check (reports_count >= 0),
  confirmed_reports integer not null default 0 check (confirmed_reports >= 0),
  rejected_reports integer not null default 0 check (rejected_reports >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Erweitert auth.users um App-Daten (docs/PRD.md Kapitel 16). email ist eine Kopie des Stands zum '
  'Zeitpunkt der Registrierung, kein laufender Sync mit auth.users.email.';

-- current_user_role()/is_admin(): siehe docs/PRD.md Kapitel 15 — hier statt in
-- 20260804122716_helper_functions.sql, da sie von dieser Tabelle abhängen (SQL-Funktionen werden von
-- Postgres bereits bei CREATE FUNCTION gegen den Katalog geprüft).
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('admin', 'super_admin');
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- handle_new_user(): legt bei jeder Registrierung automatisch das zugehörige Profil an (SECURITY
-- DEFINER, läuft unabhängig von RLS). `username` aus den Signup-Metadaten (siehe
-- app/src/services/AuthService.ts: `options.data.username`) wird als `display_name` übernommen.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- prevent_profile_privilege_escalation(): verhindert, dass Nutzer ihre eigene Rolle oder
-- vertrauensrelevanten Felder selbst verändern. Gemäß docs/PRD.md → „Vertrauenssystem": Änderungen am
-- Trust Score „ausschließlich über Backend-Services/Edge Functions, niemals direkt durch das
-- Frontend". `service_role` (Edge Functions/Backend) sowie Admin/Super Admin sind ausgenommen.
create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' or public.is_admin() then
    return new;
  end if;

  if new.role is distinct from old.role
    or new.trust_score is distinct from old.trust_score
    or new.trust_level is distinct from old.trust_level
    or new.reports_count is distinct from old.reports_count
    or new.confirmed_reports is distinct from old.confirmed_reports
    or new.rejected_reports is distinct from old.rejected_reports
  then
    raise exception 'Nur Admin, Super Admin oder Backend-Services dürfen Rolle oder Vertrauensdaten ändern.';
  end if;

  return new;
end;
$$;

create trigger enforce_profile_privilege_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_profile_privilege_escalation();

alter table public.profiles enable row level security;

-- User: „nur das eigene Profil lesen/bearbeiten ... keine anderen Nutzer sehen" (docs/PRD.md Kapitel 15).
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Keine INSERT-/DELETE-Policy für `authenticated`: Profile entstehen ausschließlich über den
-- `handle_new_user()`-Trigger (SECURITY DEFINER, umgeht RLS); Löschung erfolgt über die
-- `on delete cascade`-Beziehung zu auth.users (Konto-Löschung, docs/Architecture.md Kapitel 17).
