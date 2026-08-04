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
- [x] Lastenheft ausgefüllt (`docs/Lastenheft.md`)
- [x] Roadmap mit Meilensteinen ausgefüllt (`docs/Roadmap.md`)

## UI Design

- [x] Design-Richtlinien definiert (`docs/Design.md`, `docs/DesignSystem.md`)
- [x] Farbpalette (Dark Mode, Neon-Akzente) mit konkreten Hex-Werten festgelegt (`docs/DesignSystem.md`
  Kapitel 3)
- [ ] Typografie (Schriftfamilie, exakte Größen), Iconografie (Icon-Bibliothek) im Detail festgelegt —
  Hierarchie/Stil bereits bekannt, exakte Werte offen (`docs/DesignSystem.md` Kapitel 4, 10, 25)
- [x] Grundlegende UI-Komponenten anhand der finalen UI-Designs dokumentiert (`docs/DesignSystem.md`
  Kapitel 11–15)
- [x] Kern-Screens in den finalen UI-Designs enthalten (`docs/ui-designs/Design_PlayaLive.pdf`: Home,
  Map, Events, Artists, Favorites, Profile u. a.)

## Architektur

- [x] Datenmodell entworfen (`docs/Database.md`)
- [x] API-/Datenzugriffs-Konzept entworfen (`docs/API.md`)
- [x] Ordner-/Projektstruktur für das Expo-Projekt festgelegt (`docs/Architecture.md` Kapitel 4–5)
- [x] State-Management-Ansatz entschieden (TanStack Query + Zustand + React State)
- [x] Entscheidung zu Umgebungen/Konfiguration (.env, Secrets) getroffen (`docs/Architecture.md`
  Kapitel 17: Dev/Staging/Prod, EAS Secrets)
- [x] Technische Architektur vollständig dokumentiert (`docs/Architecture.md`, 12 Architekturentscheidungen)
- [x] Design System mit konkreten Werten aus den finalen UI-Designs erstellt (`docs/DesignSystem.md`)
- [x] ADR-Dokumente erstellt (`docs/ADR/001`–`008`, je eine bereits getroffene Entscheidung)

## Expo Setup

- [x] Expo-Projekt initialisiert (TypeScript-Template, `app/`)
- [x] Grundkonfiguration (app.json, TypeScript strict, ESLint, Prettier, Husky + lint-staged)
- [x] Ordnerstruktur gemäß Architekturentscheidung angelegt (`app/src/`, siehe `docs/Architecture.md`
  Kapitel 5)
- [x] Testing-Grundgerüst eingerichtet (Jest/jest-expo, React Native Testing Library, Maestro-Ordner
  — siehe `docs/Architecture.md` Kapitel 19); Smoke-Test grün
- [x] React Navigation, TanStack Query, Zustand, Supabase-Client, Mapbox-Init installiert und
  minimal verdrahtet (noch ohne Business-Logik)
- [x] Firebase Notifications als Abhängigkeit vorbereitet (Config-Plugins registriert; native
  Konfigurationsdateien folgen vor dem ersten nativen Build, siehe `app/README.md`)
- [x] `supabase/`-Ordner initialisiert (Supabase-CLI, `migrations/`, `functions/`)
- [x] CI-Workflow (Lint/Format/Typecheck/Test) unter `.github/workflows/ci.yml` eingerichtet
- [ ] Lokaler Dev-Build lauffähig (iOS/Android/Simulator) — noch nicht auf echtem Gerät/Simulator
  verifiziert

## Navigation

- [x] React Navigation eingerichtet (RootNavigator/AuthNavigator/MainNavigator, noch mit
  Platzhalter-Screens)
- [ ] Bottom Navigation mit 5 Elementen (Home, Map, Community-Report-Schnellzugriff, Events, Profile)
  definiert — siehe `docs/PRD.md` Kapitel 11
- [ ] Hamburger-Menü (React-Navigation-Drawer) für sekundäre Bereiche eingerichtet (Artists, Favorites,
  Happy Hours, Weather, Services, Settings, Help, Privacy, About) — siehe `docs/PRD.md` Kapitel 11,
  `docs/Architecture.md` Kapitel 7
- [ ] Community-Report-Schnellzugriff-Button (zentrales Bottom-Nav-Element) implementiert
- [ ] Login-Flow vor der Hauptnavigation abgebildet (Login ist verpflichtend, kein Gastmodus/App-Flow
  ohne Login — siehe `docs/PRD.md` Kapitel 12); Routing-Grundgerüst zwischen Login und Haupt-App über
  `authStore`/`RootNavigator` vorhanden, der eigentliche Login-Screen folgt mit dem Auth-Feature

## Home Screen

- [ ] Live-Auslastung-Übersicht und „Spielt gerade"-Anzeige
- [ ] Übersicht: aktuelle Highlights (Top-Events, Top-Locations, Trends), Party Radar
- [ ] Happy-Hours-Übersicht eingebunden
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

- [ ] Supabase-Projekte aufgesetzt (Development, Staging, Production — siehe `docs/Architecture.md`
  Kapitel 17)
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

- [x] Wetter-API-Anbindung ausgewählt (OpenWeather API, über eigenen `WeatherService`)
- [ ] Temperatur- und Wetterbedingungs-Anzeige (Home Screen, ggf. Map)
- [ ] Eigener Wetter-Screen im Menü (siehe `docs/PRD.md` Kapitel 10/11)

## Testing

- [x] Teststrategie definiert (Jest/jest-expo, React Native Testing Library, Maestro E2E — siehe
  `docs/Architecture.md` Kapitel 19)
- [ ] Unit-Tests für Kernlogik
- [ ] Manuelle Testdurchläufe für Kern-Flows (Map, Events, Favorites, Community Report, Auth)
- [ ] Fehler-/Edge-Case-Tests (kein Netz, keine Location-Berechtigung, keine Reports vorhanden, etc.)

## Release

- [ ] App-Icons/Splash-Screens final
- [ ] Store-Listing vorbereitet (Screenshots, Beschreibung)
- [ ] Build-Pipeline (EAS Build) eingerichtet
- [ ] Interner Testflug (TestFlight/Internal Testing)
- [ ] Veröffentlichung im App Store / Play Store
