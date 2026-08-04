-- Geteilte Hilfsfunktionen für alle folgenden Migrationen.
-- Referenzen: docs/Database.md, docs/PRD.md Kapitel 15 „Row-Level-Security (Supabase)".

-- set_updated_at(): aktualisiert `updated_at` bei jedem UPDATE. Wird von allen Tabellen mit
-- `updated_at`-Spalte per Trigger verwendet (siehe docs/PRD.md Kapitel 15: „Änderungen werden mit
-- Zeitstempel gespeichert").
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- current_user_role()/is_admin() folgen in der profiles-Migration (20260804122719_profiles.sql),
-- da sie von der dort erstellten `profiles`-Tabelle abhängen — SQL-Sprachfunktionen werden von
-- Postgres bereits bei CREATE FUNCTION gegen den Katalog geprüft, eine Vorwärtsreferenz auf eine noch
-- nicht existierende Tabelle würde diese Migration hier fehlschlagen lassen.

-- distance_meters(): Näherungsweise Distanz zwischen zwei Geokoordinaten in Metern
-- (äquirektangulare Approximation). Für die im Missbrauchsschutz benötigten Distanzen von
-- 100–150 Metern (docs/PRD.md → „Missbrauchsschutz bei Community Reports") ausreichend genau; kein
-- PostGIS, da dessen Einsatz nirgends als Architekturentscheidung festgelegt ist.
create or replace function public.distance_meters(
  lat1 double precision,
  lng1 double precision,
  lat2 double precision,
  lng2 double precision
)
returns double precision
language sql
immutable
as $$
  select sqrt(
    power((lat2 - lat1) * 111320, 2) +
    power((lng2 - lng1) * 111320 * cos(radians((lat1 + lat2) / 2)), 2)
  );
$$;
