# TASKS.md — Entwicklungs-Roadmap (Checkliste)

Diese Liste bildet den Gesamtfortschritt von PlayaLive ab. Häkchen werden gesetzt, sobald ein Punkt
abgeschlossen ist. Reihenfolge der Abschnitte entspricht der groben zeitlichen Reihenfolge, einzelne
Punkte können sich je nach Bedarf überlappen.

## Planung

- [x] PROJECT.md erstellt (Vision, Zielgruppe, MVP, Tech-Stack)
- [x] CLAUDE.md erstellt (Arbeitsregeln)
- [x] README.md erstellt
- [x] TASKS.md erstellt
- [ ] Lastenheft ausgefüllt (`docs/Lastenheft.md`)
- [ ] Roadmap mit Meilensteinen ausgefüllt (`docs/Roadmap.md`)
- [ ] Annahmen in PROJECT.md mit Projektverantwortlichem abgeglichen

## Design

- [ ] Design-Richtlinien definiert (`docs/Design.md`)
- [ ] Farbpalette, Typografie, Iconografie festgelegt
- [ ] Grundlegende UI-Komponenten skizziert (Wireframes)
- [ ] Kern-Screens skizziert (Karte, Strand-Detail, Profil, Login)

## Architektur

- [ ] Datenmodell entworfen (`docs/Database.md`)
- [ ] API-/Datenzugriffs-Konzept entworfen (`docs/API.md`)
- [ ] Ordner-/Projektstruktur für das Expo-Projekt festgelegt
- [ ] State-Management-Ansatz entschieden
- [ ] Entscheidung zu Umgebungen/Konfiguration (.env, Secrets) getroffen

## Expo Setup

- [ ] Expo-Projekt initialisiert (TypeScript-Template)
- [ ] Grundkonfiguration (app.json/app.config, ESLint, Prettier)
- [ ] Ordnerstruktur gemäß Architekturentscheidung angelegt
- [ ] Lokaler Dev-Build lauffähig (iOS/Android/Simulator)

## Navigation

- [ ] React Navigation eingerichtet
- [ ] Grundstruktur (Tab-/Stack-Navigation) definiert
- [ ] Auth-Flow vs. App-Flow (eingeloggt/nicht eingeloggt) abgebildet

## Screens

- [ ] Kartenübersicht (Strände in der Nähe)
- [ ] Strand-Detailansicht
- [ ] Check-in-Flow
- [ ] Profilseite
- [ ] Login/Registrierung
- [ ] Einstellungen

## Komponenten

- [ ] Basis-UI-Kit (Buttons, Inputs, Cards, Badges)
- [ ] Strand-Karten-Komponente (Kartenmarker/Popup)
- [ ] Statusanzeige-Komponente (Andrang/Wetter/Warnungen)
- [ ] Live-Update-/Feed-Komponente

## Backend

- [ ] Supabase-Projekt aufgesetzt
- [ ] Datenbankschema gemäß `docs/Database.md` umgesetzt
- [ ] Row-Level-Security-Regeln definiert
- [ ] API-/Datenzugriffsschicht im Client implementiert

## Supabase

- [ ] Auth (E-Mail/Passwort und/oder Social Login) konfiguriert
- [ ] Realtime-Subscriptions für Live-Updates eingerichtet
- [ ] Storage für Bilder (Check-in-Fotos) konfiguriert
- [ ] Edge Functions (falls nötig) definiert

## Mapbox

- [ ] Mapbox-Account/Token eingerichtet
- [ ] Karten-Integration in Expo
- [ ] Standortberechtigungen (Location Permissions) implementiert
- [ ] Strand-Marker und Clustering auf der Karte

## Auth

- [ ] Registrierung
- [ ] Login/Logout
- [ ] Passwort-Reset
- [ ] Geschützte Routen/Screens

## Notifications

- [ ] Expo Notifications eingerichtet
- [ ] Push-Token-Registrierung mit Supabase verknüpft
- [ ] Benachrichtigungstypen definiert (Warnung, Freund in der Nähe, Event)
- [ ] Nutzer-Einstellungen für Benachrichtigungen

## Testing

- [ ] Teststrategie definiert (Unit/Integration/E2E, Umfang)
- [ ] Unit-Tests für Kernlogik
- [ ] Manuelle Testdurchläufe für Kern-Flows (Check-in, Auth, Karte)
- [ ] Fehler-/Edge-Case-Tests (kein Netz, keine Location-Berechtigung, etc.)

## Release

- [ ] App-Icons/Splash-Screens final
- [ ] Store-Listing vorbereitet (Screenshots, Beschreibung)
- [ ] Build-Pipeline (EAS Build) eingerichtet
- [ ] Interner Testflug (TestFlight/Internal Testing)
- [ ] Veröffentlichung im App Store / Play Store
