-- Push-Token und Benachrichtigungs-Einstellung: ADR-007 legt fest, dass Push-Token „mit Supabase
-- verknüpft" werden und Nutzer-Einstellungen serverseitig respektiert werden, bevor eine Push-
-- Benachrichtigung ausgelöst wird. In 20260804122740_notifications.sql wurde das bewusst
-- zurückgestellt („zur Bestätigung durch den Product Owner vorgelegt") — nach Rückfrage im
-- Push-Notification-Feature ergänzt als zwei zusätzliche, additive Spalten auf der bestehenden
-- `profiles`-Tabelle (kein eigenes Mehrgeräte-Push-Token-Konzept dokumentiert/gefordert, ein Token pro
-- Nutzer genügt für den MVP-Umfang dieses Auftrags).
--
-- Push-Notification-Dienst ist laut ADR-007 Firebase Notifications; `push_token` speichert das
-- Firebase-Cloud-Messaging-Token des zuletzt genutzten Geräts. Bestehende RLS-Policies decken beide
-- Spalten bereits ab: `profiles_update_own_or_admin` erlaubt Nutzern das Ändern des eigenen Profils,
-- und `prevent_profile_privilege_escalation()` sperrt ausschließlich Rolle/Vertrauensdaten — beide
-- neuen Spalten sind davon nicht betroffen, daher keine Trigger-/Policy-Änderung nötig.

alter table public.profiles
  add column push_token text,
  add column push_notifications_enabled boolean not null default true;

comment on column public.profiles.push_token is
  'Firebase-Cloud-Messaging-Token des zuletzt registrierten Geräts (docs/ADR/007-Notifications.md). '
  'NULL, solange keine Push-Berechtigung erteilt wurde bzw. nach Logout/Widerruf entfernt.';

comment on column public.profiles.push_notifications_enabled is
  'Nutzer-Einstellung „Benachrichtigungen" (docs/API.md Kapitel 10: „Benachrichtigungseinstellungen '
  'abrufen/aktualisieren"). Serverseitige Push-Auslösung muss dies vor dem Versand prüfen.';
