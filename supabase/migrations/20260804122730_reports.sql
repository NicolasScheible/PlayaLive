-- reports + report_flags + location_live_status: Community-Meldungen zur Auslastung
-- (docs/PRD.md Kapitel 16, docs/Database.md 2.10/2.11) inkl. Missbrauchsschutz (Rate Limiting,
-- Geofencing — docs/PRD.md Kapitel 15 „Missbrauchsschutz bei Community Reports") und aggregierter
-- Live-Status (docs/PRD.md Kapitel 15 „Community-Report-Aggregation (Live-Status)").
--
-- 🔴 Mehrere Zahlenwerte in dieser Migration sind in docs/PRD.md ausdrücklich als „Beispiel"
-- gekennzeichnet oder dort gar nicht beziffert. Als Annahme markiert, zur Bestätigung durch den
-- Product Owner vorgelegt — nicht stillschweigend als endgültig zu behandeln:
--   - Rate-Limit-Fenster: 10 Minuten (PRD-Beispiel „alle 10 Minuten")
--   - Geofencing-Radius: 150 Meter (oberes Ende der PRD-Beispielspanne „100–150 Meter")
--   - Mindestanzahl an Meldungen für „confident" Status: 3 (in PRD nicht beziffert)
--   - Trust-Score-Gewichtung: `greatest(0.5, least(1.5, trust_score / 100.0))` — weder Skala noch
--     Formel für trust_score sind in docs/PRD.md/docs/Database.md festgelegt; hier als beschränkter
--     Multiplikator angenommen (0,5× bis 1,5×), damit neue Mitglieder (trust_score = 0) nie komplett
--     ausgeschlossen werden.
--   - Automatische Missbrauchserkennung („auffälliges Verhalten...", PRD Kapitel 15) ist rein
--     qualitativ beschrieben, ohne prüfbare Schwellenwerte — bewusst NICHT umgesetzt, siehe
--     Zusammenfassung.

create type public.occupancy_level as enum ('low', 'medium', 'high');

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  location_id uuid not null references public.locations (id) on delete cascade,
  occupancy_level public.occupancy_level not null,
  wait_time_minutes integer check (wait_time_minutes >= 0),
  mood text,
  music_genre text,
  comment text,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  created_at timestamptz not null default now()
);

comment on table public.reports is
  'Unveränderliche Community-Meldungen — keine updated_at-Spalte, kein UPDATE für Nutzer '
  '(docs/Database.md 2.10 nennt ausschließlich einen Erstellungszeitstempel).';

create index reports_location_id_created_at_idx on public.reports (location_id, created_at);
create index reports_user_id_idx on public.reports (user_id);

-- enforce_report_submission_rules(): Rate Limiting + Geofencing serverseitig durchgesetzt
-- (docs/PRD.md Kapitel 15 „Missbrauchsschutz bei Community Reports") — beides erfordert Zugriff auf
-- andere Zeilen/Tabellen und kann daher nicht als reiner CHECK-Constraint formuliert werden.
create or replace function public.enforce_report_submission_rules()
returns trigger
language plpgsql
stable
as $$
declare
  recent_report_exists boolean;
  location_lat double precision;
  location_lng double precision;
begin
  select exists (
    select 1 from public.reports
    where user_id = new.user_id
      and location_id = new.location_id
      and created_at > now() - interval '10 minutes'
  ) into recent_report_exists;

  if recent_report_exists then
    raise exception 'RATE_LIMITED: Bereits ein Report für diese Location in den letzten 10 Minuten.';
  end if;

  select latitude, longitude into location_lat, location_lng
  from public.locations
  where id = new.location_id;

  -- Fehlen die Geokoordinaten der Location (unvollständige Stammdaten), wird die Geofencing-Prüfung
  -- übersprungen statt legitime Reports pauschal abzulehnen.
  if location_lat is not null and location_lng is not null then
    if public.distance_meters(new.latitude, new.longitude, location_lat, location_lng) > 150 then
      raise exception 'GEOFENCE_VIOLATION: Zu weit von der Location entfernt.';
    end if;
  end if;

  return new;
end;
$$;

create trigger enforce_report_submission_rules_before_insert
  before insert on public.reports
  for each row
  execute function public.enforce_report_submission_rules();

alter table public.reports enable row level security;

-- Rohdaten einzelner Reports (inkl. Kommentar, exakte Koordinaten) sind ausschließlich für den
-- Verfasser und Admin/Super Admin sichtbar — der aggregierte, anonymisierte Live-Status für alle
-- Nutzer läuft stattdessen über die View `location_live_status` unten (docs/PRD.md Kapitel 15:
-- Aggregation „serverseitig").
create policy "reports_select_own_or_admin"
  on public.reports for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "reports_insert_own"
  on public.reports for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "reports_delete_admin"
  on public.reports for delete
  to authenticated
  using (public.is_admin());

create table public.report_flags (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports (id) on delete cascade,
  flagged_by_user_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (report_id, flagged_by_user_id)
);

create index report_flags_report_id_idx on public.report_flags (report_id);

alter table public.report_flags enable row level security;

create policy "report_flags_select_own_or_admin"
  on public.report_flags for select
  to authenticated
  using (flagged_by_user_id = auth.uid() or public.is_admin());

create policy "report_flags_insert_own"
  on public.report_flags for insert
  to authenticated
  with check (flagged_by_user_id = auth.uid());

create policy "report_flags_delete_admin"
  on public.report_flags for delete
  to authenticated
  using (public.is_admin());

-- location_live_status: aggregierter Live-Status je Location (Zeitgewichtung, Vertrauensscore-
-- Gewichtung, Mindestanzahl, Mehrfachbestätigung — docs/PRD.md Kapitel 15). Bewusst OHNE
-- `security_invoker` (Postgres-Standardverhalten für Views): die View wertet Reports aller Nutzer aus,
-- nicht nur die des Aufrufers, und gibt ausschließlich aggregierte, nicht auf einzelne Nutzer
-- zurückführbare Werte aus (keine user_id, kein Kommentar, keine Koordinaten) — Zugriff daher über
-- einfaches GRANT statt Row-Level-Security geregelt.
create view public.location_live_status
with (security_invoker = false)
as
with recent_reports as (
  select
    r.location_id,
    r.occupancy_level,
    r.wait_time_minutes,
    r.created_at,
    case
      when r.created_at >= now() - interval '10 minutes' then 1.0
      when r.created_at >= now() - interval '20 minutes' then 0.75
      when r.created_at >= now() - interval '30 minutes' then 0.5
      else 0.25
    end as time_weight,
    greatest(0.5, least(1.5, coalesce(p.trust_score, 0) / 100.0)) as trust_weight,
    case r.occupancy_level
      when 'low' then 1
      when 'medium' then 2
      when 'high' then 3
    end as level_value
  from public.reports r
  join public.profiles p on p.id = r.user_id
  where r.created_at >= now() - interval '45 minutes'
),
weighted as (
  select
    location_id,
    count(*) as report_count,
    sum(time_weight * trust_weight) as total_weight,
    sum(time_weight * trust_weight * level_value) as weighted_level_sum,
    round(avg(wait_time_minutes))::int as wait_time_minutes,
    max(created_at) as last_reported_at
  from recent_reports
  group by location_id
)
select
  location_id,
  report_count,
  (report_count >= 3) as is_confident,
  wait_time_minutes,
  last_reported_at,
  case round(weighted_level_sum / nullif(total_weight, 0))
    when 1 then 'low'
    when 2 then 'medium'
    when 3 then 'high'
  end::public.occupancy_level as occupancy_level
from weighted;

grant select on public.location_live_status to authenticated;
