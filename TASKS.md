# TASKS.md — Entwicklungs-Roadmap (Checkliste)

Diese Liste bildet den Gesamtfortschritt von PlayaLive (Live-Event- und Party-App für Playa de Palma) ab.
Häkchen werden gesetzt, sobald ein Punkt abgeschlossen ist. Reihenfolge der Abschnitte entspricht der
groben zeitlichen Reihenfolge, einzelne Punkte können sich je nach Bedarf überlappen.

## Projektplanung

- [x] PROJECT.md erstellt (Vision, Zielgruppe, MVP, Tech-Stack)
- [x] CLAUDE.md erstellt (Arbeitsregeln)
- [x] README.md erstellt
- [x] TASKS.md erstellt
- [x] Projektdefinition auf Nightlife-/Event-App für Playa de Palma korrigiert
- [ ] Lastenheft ausgefüllt (`docs/Lastenheft.md`)
- [ ] Roadmap mit Meilensteinen ausgefüllt (`docs/Roadmap.md`)

## UI Design

- [ ] Design-Richtlinien definiert (`docs/Design.md`)
- [ ] Farbpalette (Dark Mode, Neon-Akzente), Typografie, Iconografie festgelegt
- [ ] Grundlegende UI-Komponenten skizziert (Wireframes)
- [ ] Kern-Screens skizziert (Home, Map, Events, Artists, Favorites, Profile)

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
- [ ] Grundstruktur (Tab-/Stack-Navigation: Home, Map, Events, Artists, Favorites, Profile) definiert
- [ ] Auth-Flow vs. App-Flow (eingeloggt/nicht eingeloggt) abgebildet

## Home Screen

- [ ] Übersicht: aktuelle Highlights (Top-Events, Top-Locations, Trends)
- [ ] Einstieg in Live Map, Events, Artists
- [ ] Wetter-Anzeige eingebunden

## Map Screen

- [ ] Live Map mit Locations (Clubs/Bars)
- [ ] Live-Auslastungs-Anzeige pro Location (Leer/Mittel/Voll)
- [ ] Location-Detailansicht (Öffnungszeiten, Specials, Events)

## Events

- [ ] Tagesprogramm-Ansicht
- [ ] Kommende Events
- [ ] Event-Detailansicht (Künstler, Startzeit, Location)

## Artists

- [ ] Künstlerprofile (DJs)
- [ ] Auftritte (aktuelle/kommende) pro Künstler
- [ ] Künstler favorisierbar

## Favorites

- [ ] Locations speichern
- [ ] Künstler speichern
- [ ] Übersicht gespeicherter Favoriten
- [ ] Benachrichtigungen bei Neuigkeiten zu Favoriten

## Profile

- [ ] Profilseite (Nutzerdaten)
- [ ] Einstellungen (u. a. Benachrichtigungen)
- [ ] Login/Logout

## Supabase Backend

- [ ] Supabase-Projekt aufgesetzt
- [ ] Datenbankschema gemäß `docs/Database.md` umgesetzt
- [ ] Row-Level-Security-Regeln definiert
- [ ] API-/Datenzugriffsschicht im Client implementiert
- [ ] Auth (E-Mail/Passwort und/oder Social Login) konfiguriert

## Mapbox Integration

- [ ] Mapbox-Account/Token eingerichtet
- [ ] Karten-Integration in Expo
- [ ] Standortberechtigungen (Location Permissions) implementiert
- [ ] Location-Marker und Clustering auf der Karte

## Community Reports

- [ ] Report-Flow: Nutzer meldet Auslastung einer Location
- [ ] Validierung/Aggregation mehrerer Reports pro Location
- [ ] Anzeige der aktuellen Auslastung basierend auf Reports

## Live Updates

- [ ] Supabase-Realtime-Subscriptions für Auslastung/Reports
- [ ] Live-Aktualisierung der Map/Location-Ansicht ohne manuelles Neuladen
- [ ] Live-Aktualisierung von Event-/Artist-Daten bei Änderungen

## Notifications

- [ ] Firebase Notifications eingerichtet
- [ ] Push-Token-Registrierung mit Supabase verknüpft
- [ ] Benachrichtigungstypen definiert (Favoriten-Update, Event startet bald, Special)
- [ ] Nutzer-Einstellungen für Benachrichtigungen

## Wetter

- [ ] Wetter-API-Anbindung ausgewählt
- [ ] Temperatur- und Wetterbedingungs-Anzeige (Home Screen, ggf. Map)

## Testing

- [ ] Teststrategie definiert (Unit/Integration/E2E, Umfang)
- [ ] Unit-Tests für Kernlogik
- [ ] Manuelle Testdurchläufe für Kern-Flows (Map, Events, Favorites, Community Report, Auth)
- [ ] Fehler-/Edge-Case-Tests (kein Netz, keine Location-Berechtigung, keine Reports vorhanden, etc.)

## Release

- [ ] App-Icons/Splash-Screens final
- [ ] Store-Listing vorbereitet (Screenshots, Beschreibung)
- [ ] Build-Pipeline (EAS Build) eingerichtet
- [ ] Interner Testflug (TestFlight/Internal Testing)
- [ ] Veröffentlichung im App Store / Play Store
