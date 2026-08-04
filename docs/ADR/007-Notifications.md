# ADR-007: Notifications

## Status

Accepted

## Datum

2026-08-04

## Kontext

PlayaLive nutzt Push-Benachrichtigungen als zentralen Rückkehr-Mechanismus, damit Nutzer auch außerhalb
der App über relevante Neuigkeiten zu ihren Favoriten, bevorstehenden Events und Specials/Happy Hours
informiert werden. Die Umsetzung muss sich in die bestehende Service-Layer- und Realtime-Architektur
einfügen.

## Problemstellung

Welcher Push-Notification-Dienst wird verwendet, wie werden Push-Token verwaltet, welche
Benachrichtigungstypen existieren, und wie greift die App auf Benachrichtigungen und deren Einstellungen
zu?

## Entscheidung

- **Push-Notification-Dienst:** Firebase Notifications.
- **Datenzugriff:** ausschließlich über den `NotificationService` (Service Layer, siehe ADR-005) — kein
  direkter Zugriff aus Screens/Komponenten auf Firebase oder die `notifications`-Tabelle.
- **Push-Token-Registrierung:** Push-Token werden mit Supabase verknüpft, um Benachrichtigungen einem
  Nutzer zuordnen zu können.
- **Benachrichtigungstypen:** u. a. Favoriten-Update, Event startet bald, Special/Happy Hour — jeweils
  verknüpft mit dem zugehörigen Bezugsobjekt (Location/Artist/Event).
- **Datenmodell:** Benachrichtigungen werden in der Tabelle `notifications` (ID, User-Referenz, Typ,
  Bezugs-Objekt, Titel, Nachricht, Gelesen-Status, Zeitstempel) gespeichert.
- **Nutzer-Einstellungen:** Nutzer können ihre Benachrichtigungseinstellungen abrufen und aktualisieren
  (z. B. welche Benachrichtigungstypen aktiv sind).
- **Realtime-Einbindung:** Notifications gehören zu den gezielt per Realtime synchronisierten Daten (siehe
  ADR-003) — neue Benachrichtigungen erscheinen ohne manuelles Neuladen.

## Begründung

Firebase Notifications war bereits als Push-Dienst im Tech-Stack festgelegt (`PROJECT.md`) und deckt
sowohl iOS als auch Android einheitlich ab. Die Kopplung der Push-Token an Supabase ermöglicht es, Server-
seitig gezielt einzelne Nutzer anzusprechen (z. B. bei Favoriten-Updates), ohne eine separate
Nutzerverwaltung für Push-Zwecke zu benötigen. Die Anbindung über einen dedizierten `NotificationService`
folgt konsequent der in ADR-005 getroffenen Service-Layer-Entscheidung und verhindert, dass Firebase-
spezifische Details in die UI durchsickern. Die Realtime-Einbindung von Notifications stellt sicher, dass
In-App-Benachrichtigungslisten (z. B. ein Glocken-Icon mit ungelesenen Einträgen) ohne zusätzlichen
Pull-to-Refresh aktuell bleiben, konsistent mit dem übrigen Realtime-Konzept.

## Konsequenzen

- Jede neue Benachrichtigungsart wird über den bestehenden `NotificationService` und die bestehende
  `notifications`-Tabelle abgebildet, nicht über einen parallelen Mechanismus.
- Push-Token-Lebenszyklus (Registrierung, Aktualisierung bei Token-Wechsel, Entfernung bei Logout) ist
  vom `NotificationService` zu verwalten.
- Neue Benachrichtigungstypen müssen sich in das bestehende Datenmodell (Typ, Bezugs-Objekt, Titel,
  Nachricht) einfügen, statt eigene Sonderfelder einzuführen.
- Nutzer-Einstellungen zu Benachrichtigungen müssen serverseitig respektiert werden, bevor eine
  entsprechende Push-Benachrichtigung ausgelöst wird.

## Betrachtete Alternativen

- **Anderer Push-Dienst (z. B. OneSignal, Expo Notifications als alleiniger Dienst) statt Firebase:**
  nicht Gegenstand dieser ADR — Firebase Notifications war bereits als Teil des Tech-Stacks in
  `PROJECT.md` festgelegt.
- **Direkter Firebase-Zugriff aus Komponenten statt `NotificationService`:** verworfen zugunsten der in
  ADR-005 festgelegten Service-Layer-Architektur.
- **Kein Realtime für Notifications, ausschließlich Push-Zustellung:** verworfen, da In-App-
  Benachrichtigungslisten sonst inkonsistent mit tatsächlich zugestellten Push-Benachrichtigungen sein
  könnten.

## Referenzen

- `PROJECT.md` → Tech-Stack (Firebase Notifications)
- `docs/PRD.md` Kapitel 9 „User Journey" (Rückkehr über Push-Benachrichtigungen), Kapitel 15 (Service
  Layer, `NotificationService`)
- `docs/Architecture.md` Kapitel 3 „Technologie-Stack" (Firebase Notifications)
- `docs/Architecture.md` Kapitel 8 „Service Layer" (`NotificationService`)
- `docs/Architecture.md` Kapitel 9 „Repository Pattern" (`NotificationService` ohne Repository-Schicht)
- `docs/Architecture.md` Kapitel 11 „Realtime-Architektur" (Notifications als Realtime-Kandidat, ADR-003)
- `docs/DesignSystem.md` — visuelle Gestaltung von Benachrichtigungslisten/-Badges
- `docs/Database.md` 2.14 „Notifications"
- `docs/API.md` Kapitel 10 „Notifications"
