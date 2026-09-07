-- Hält `profiles.email` mit `auth.users.email` synchron (docs/ADR/002-Authentication.md
-- „E-Mail-Verifizierung", docs/Architecture.md Kapitel 12 „E-Mail-Bestätigung"). Notwendig seit
-- Registrierung über eine anonyme Session läuft (app/src/services/AuthService.ts:
-- `signUpWithPassword()` → `signInAnonymously()` + `updateUser({ email, password })`): `auth.users.email`
-- ist bei der Konto-Erstellung (INSERT, siehe `handle_new_user()` in 20260804122719_profiles.sql) noch
-- leer und wird erst nachträglich per `updateUser()` gesetzt — ohne diesen Trigger bliebe
-- `profiles.email` für jeden neuen Nutzer dauerhaft NULL, obwohl `ProfileScreen.tsx`/`DrawerContent.tsx`
-- genau dieses Feld anzeigen. Der ursprüngliche Kommentar auf `public.profiles` („email ist eine Kopie
-- des Stands zum Zeitpunkt der Registrierung, kein laufender Sync") galt für den alten
-- `supabase.auth.signUp()`-Flow, bei dem die E-Mail bereits bei der Registrierung feststand — das ist
-- unter der neuen Architektur nicht mehr der Fall.
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;

  return new;
end;
$$;

create trigger sync_profile_email_after_update
  after update on auth.users
  for each row
  execute function public.sync_profile_email();

comment on table public.profiles is
  'Erweitert auth.users um App-Daten (docs/PRD.md Kapitel 16). email wird bei Anlage (handle_new_user) '
  'und bei jeder Änderung von auth.users.email (sync_profile_email) übernommen — siehe '
  '20260907100000_sync_profiles_email_on_auth_user_update.sql.';
