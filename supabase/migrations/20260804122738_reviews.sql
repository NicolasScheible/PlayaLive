-- reviews + review_flags: Sterne-Bewertung (1–5) mit Kommentar zu einer Location oder einem Artist
-- (docs/PRD.md Kapitel 16 „Bewertungen (Reviews)", docs/Database.md 2.12/2.13). Eine gemeinsame
-- Entität statt getrenntem Kommentar-System — kein separates Kommentar-Modell.
--
-- 🔴 Annahmen, zur Bestätigung durch den Product Owner vorgelegt:
--   - „Jeder Nutzer kann pro Location oder Artist eine eigene Bewertung ... abgeben" wird als
--     Unique-Constraint (user_id, target_type, target_id) durchgesetzt, analog zu `favorites`. Ein
--     erneutes Bewerten nach Soft-Delete der eigenen Review ist damit nicht möglich, ohne die
--     bestehende (gelöschte) Zeile zu reaktivieren — die Operationalisierung von „bearbeiten oder
--     löschen" (Kapitel 16) lässt offen, ob nach Löschung eine neue Bewertung erlaubt sein soll.
--   - Sortierung „Hilfreichste" ist laut docs/PRD.md Kapitel 22 „Offene Punkte" explizit ungeklärt und
--     wird hier NICHT umgesetzt (kein Helpful-/Like-Zähler) — nur „Neueste" ist über `created_at`
--     möglich.

create type public.review_target_type as enum ('location', 'artist');

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  target_type public.review_target_type not null,
  target_id uuid not null,
  rating smallint not null check (rating between 1 and 5),
  comment_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (user_id, target_type, target_id)
);

create index reviews_target_idx on public.reviews (target_type, target_id) where deleted_at is null;
create index reviews_user_id_idx on public.reviews (user_id);

create trigger set_reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

-- validate_review_target(): prüft „Existiert die Zielressource?" wie `validate_favorite_target()`
-- (20260804122728_favorites.sql) — polymorphe Beziehungen erlauben keinen klassischen Fremdschlüssel.
create or replace function public.validate_review_target()
returns trigger
language plpgsql
stable
as $$
begin
  if new.target_type = 'location' then
    if not exists (select 1 from public.locations where id = new.target_id and deleted_at is null) then
      raise exception 'REVIEW_INVALID_TARGET: Location % existiert nicht oder ist gelöscht.', new.target_id;
    end if;
  elsif new.target_type = 'artist' then
    if not exists (select 1 from public.artists where id = new.target_id and deleted_at is null) then
      raise exception 'REVIEW_INVALID_TARGET: Artist % existiert nicht oder ist gelöscht.', new.target_id;
    end if;
  end if;

  return new;
end;
$$;

create trigger validate_review_target_before_insert
  before insert on public.reviews
  for each row
  execute function public.validate_review_target();

alter table public.reviews enable row level security;

-- Analog zu locations/artists/events: nicht-gelöschte Bewertungen sind für alle authentifizierten
-- Nutzer lesbar (docs/PRD.md Kapitel 15 „User: darf öffentliche ... lesen"), Admin sieht zusätzlich
-- gelöschte zur Moderation. Eigentümer sehen zusätzlich immer die eigene Bewertung, auch soft-deleted —
-- ohne diesen dritten Fall würde Postgres das eigene Soft-Delete (UPDATE deleted_at) selbst ablehnen,
-- da die RLS-UPDATE-Prüfung verlangt, dass die neue Zeile auch nach der Änderung für den Ausführenden
-- über eine SELECT-Policy sichtbar bleibt.
create policy "reviews_select_active_or_admin"
  on public.reviews for select
  to authenticated
  using (deleted_at is null or public.is_admin() or user_id = auth.uid());

create policy "reviews_insert_own"
  on public.reviews for insert
  to authenticated
  with check (user_id = auth.uid());

-- Eigene Bewertung bearbeiten oder löschen (Soft Delete über `deleted_at`, docs/PRD.md Kapitel 16);
-- Admin zusätzlich zur Moderation („moderiert Community ... Bewertungen, Kommentare", Kapitel 15).
create policy "reviews_update_own_or_admin"
  on public.reviews for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "reviews_delete_super_admin"
  on public.reviews for delete
  to authenticated
  using (public.current_user_role() = 'super_admin');

create table public.review_flags (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews (id) on delete cascade,
  flagged_by_user_id uuid not null references public.profiles (id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now(),
  unique (review_id, flagged_by_user_id)
);

-- Index auf beiden Fremdschlüsseln von Beginn an (siehe Lücke bei `report_flags.flagged_by_user_id`,
-- nachträglich behoben in 20260804122742_report_flags_flagged_by_user_id_index.sql).
create index review_flags_review_id_idx on public.review_flags (review_id);
create index review_flags_flagged_by_user_id_idx on public.review_flags (flagged_by_user_id);

alter table public.review_flags enable row level security;

create policy "review_flags_select_own_or_admin"
  on public.review_flags for select
  to authenticated
  using (flagged_by_user_id = auth.uid() or public.is_admin());

create policy "review_flags_insert_own"
  on public.review_flags for insert
  to authenticated
  with check (flagged_by_user_id = auth.uid());

create policy "review_flags_delete_admin"
  on public.review_flags for delete
  to authenticated
  using (public.is_admin());
