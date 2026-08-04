-- notifications: Benachrichtigungen für Nutzer, z. B. zu Favoriten, Events, Specials, Happy Hours
-- (docs/PRD.md Kapitel 16, docs/Database.md 2.14). `related_type` verwendet bewusst denselben
-- Wertebereich wie `favorites.target_type` (Location/Artist/Event) statt eines eigenen Enums — gleiche
-- fachliche Domäne, kein Grund für eine parallele Lösung (siehe CLAUDE.md → „keine parallelen
-- Lösungen für dasselbe Problem").
--
-- Notifications entstehen ausschließlich serverseitig (Backend-Services/Edge Functions, analog zum
-- Vertrauenssystem — docs/PRD.md Kapitel 15), daher keine INSERT-Policy für `authenticated`
-- (nur `service_role`, umgeht RLS). Nutzer dürfen ausschließlich `is_read` der eigenen
-- Benachrichtigungen ändern (docs/API.md Kapitel 10: „Benachrichtigung als gelesen markieren").
--
-- 🔴 Annahme: Benachrichtigungseinstellungen und Push-Token-Registrierung (docs/API.md Kapitel 10)
-- sind in docs/Database.md nicht als eigene Tabelle dokumentiert — hier bewusst NICHT umgesetzt, um
-- keine undokumentierte Datenstruktur zu erfinden (CLAUDE.md → „keine Annahmen ohne Rückfrage").

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  related_type public.favorite_target_type,
  related_id uuid,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint notifications_related_type_id_together check (
    (related_type is null) = (related_id is null)
  )
);

create index notifications_user_id_created_at_idx on public.notifications (user_id, created_at desc);

-- restrict_notification_update_to_is_read(): Nutzer dürfen ausschließlich `is_read` ändern, alle
-- übrigen Felder sind serverseitig verwaltet — analog zu
-- `prevent_profile_privilege_escalation()` (20260804122719_profiles.sql).
create or replace function public.restrict_notification_update_to_is_read()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() = 'service_role' or public.is_admin() then
    return new;
  end if;

  if new.user_id is distinct from old.user_id
    or new.type is distinct from old.type
    or new.related_type is distinct from old.related_type
    or new.related_id is distinct from old.related_id
    or new.title is distinct from old.title
    or new.message is distinct from old.message
    or new.created_at is distinct from old.created_at
  then
    raise exception 'Nutzer dürfen nur is_read der eigenen Benachrichtigung ändern.';
  end if;

  return new;
end;
$$;

create trigger enforce_notification_update_restriction
  before update on public.notifications
  for each row
  execute function public.restrict_notification_update_to_is_read();

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Keine INSERT-/DELETE-Policy für `authenticated`: Benachrichtigungen entstehen ausschließlich über
-- Backend-Services/Edge Functions (`service_role`, umgeht RLS).
