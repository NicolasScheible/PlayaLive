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

- [x] React Navigation eingerichtet (RootNavigator/AuthNavigator/MainNavigator; `MainNavigator` zeigt
  `HomeScreen`, `MapScreen` und den `LocationDetail`-Platzhalter, noch als einfacher Stack ohne die
  übrigen Bottom-Tabs)
- [ ] Bottom Navigation mit 5 Elementen (Home, Map, Community-Report-Schnellzugriff, Events, Profile)
  definiert — siehe `docs/PRD.md` Kapitel 11
- [ ] Hamburger-Menü (React-Navigation-Drawer) für sekundäre Bereiche eingerichtet (Artists, Favorites,
  Happy Hours, Weather, Services, Settings, Help, Privacy, About) — siehe `docs/PRD.md` Kapitel 11,
  `docs/Architecture.md` Kapitel 7
- [ ] Community-Report-Schnellzugriff-Button (zentrales Bottom-Nav-Element) implementiert
- [x] Login-Flow vor der Hauptnavigation abgebildet (Login ist verpflichtend, kein Gastmodus/App-Flow
  ohne Login — siehe `docs/PRD.md` Kapitel 12): Login-, Registrierungs- und Passwort-vergessen-Screen
  über `AuthNavigator`, Routing über `authStore`/`RootNavigator`

## Home Screen

- [x] Live-Auslastung-Übersicht und „Spielt gerade"-Anzeige (`LiveOccupancySection`,
  `CurrentActsSection`, `NextActSection` — `useLiveOccupancy`/`useCurrentActs`/`useNextAct`)
- [x] Übersicht: aktuelle Highlights (`TodayHighlightsSection`/`useTodayHighlights`, umgesetzt als
  „heutige Events" statt einer nicht dokumentierten „Top"/„Trend"-Rangfolge — „Top-Locations"/„Trends"/
  „Party Radar" bewusst nicht erfunden, da PRD/Database.md kein Ranking-Kriterium definieren)
- [x] Happy-Hours-Übersicht eingebunden (`HappyHoursSection`, inkl. Specials, `SpecialsSection`)
- [x] Einstieg in Live Map (`MapQuickAccessButton` navigiert seit dem Live-Map-Feature zum echten
  `MapScreen`); Einstieg in Events/Artists bewusst nicht Teil dieses Schritts
- [x] Wetter-Anzeige eingebunden (`WeatherWidget`/`useWeather`, siehe Abschnitt „Wetter")
- [x] Header, Begrüßung, Ladezustände (Skeleton), Fehlerzustände, Pull-to-Refresh je Section
  (`useHomeDashboard`, `src/components/Skeleton*`/`ErrorState`/`EmptyState`)

## Map Screen

- [x] Live Map mit Locations (Clubs/Bars) — `MapScreen`, natives Mapbox-Clustering
  (`LocationMarkersLayer`), Filter (Kategorie/Auslastung/geöffnet/Favoriten über `filterStore`),
  Standort (`useUserLocation`, ohne automatische Consent-Abfrage), Zoom Controls, Kompass, Loading-/
  Error-/Empty-State
- [x] Live-Auslastungs-Anzeige pro Location (Leer/Mittel/Voll) — Marker-Farbe + Bottom-Sheet-Badge über
  `location_live_status`, per Realtime aktualisiert (kein kompletter Reload)
- [ ] Location-Detailansicht (Öffnungszeiten, Specials, Events) — Bottom Sheet zeigt bereits Happy
  Hours/Specials/aktuelle Events kompakt; der „Details"-Button navigiert vorerst zu einem
  Platzhalter-Screen (`LocationDetailScreen`), der eigentliche Detail-Screen ist ein eigener Auftrag

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
- [x] Login/Logout (E-Mail & Passwort über `useAuth()`/`AuthService` — Aufruf aktuell auf dem
  Main-Platzhalter, echter Ort folgt mit dieser Profilseite; Apple/Google Sign-In noch offen)

## Supabase Backend

- [ ] Supabase-Projekte aufgesetzt (Development, Staging, Production — siehe `docs/Architecture.md`
  Kapitel 17)
- [x] Datenbankschema gemäß `docs/Database.md` umgesetzt (`supabase/migrations/`: profiles, locations,
  artists, events/event_artists, favorites, reports/report_flags + aggregierte
  `location_live_status`-View, specials, happy_hours, reviews/review_flags, notifications; partners/
  trust_score_events noch offen — partners ist laut `docs/Database.md` 2.15 explizit „Nicht Teil des
  MVP" (v2.x), trust_score_events folgt mit dem Vertrauenssystem-Feature)
- [x] Row-Level-Security-Regeln definiert (alle Tabellen + Storage-Objekte, „Deny by Default" gemäß
  `docs/PRD.md` Kapitel 15)
- [x] API-/Datenzugriffsschicht im Client implementiert (Service Layer: `AuthService`,
  `LocationService`, `ArtistService`, `EventService`, `FavoriteService`, `ReportService` +
  `ReportRepository`, `SpecialService`, `HappyHourService`, `ReviewService` + `ReviewRepository`,
  `NotificationService`, `WeatherService`)
- [x] Edge Function `weather` (`supabase/functions/weather/`) als serverseitiger OpenWeather-Proxy —
  OpenWeather-API-Key muss vor Betrieb per `supabase secrets set OPENWEATHER_API_KEY=...` gesetzt
  werden (siehe `app/README.md` → „Supabase Edge Functions")
- [ ] Auth (E-Mail/Passwort und/oder Social Login) konfiguriert — clientseitig implementiert
  (E-Mail/Passwort: Login, Registrierung, Passwort-Reset, Session-Handling), serverseitige
  Supabase-Projekt-Konfiguration (Rate Limits, Redirect-URLs, E-Mail-Templates) noch offen; Apple/
  Google Sign-In noch nicht angebunden

## Mapbox Integration

- [ ] Mapbox-Account/Token eingerichtet (echtes Produktions-Token — clientseitig bereits über
  `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` vorgesehen, siehe `app/README.md`)
- [x] Karten-Integration in Expo (`@rnmapbox/maps`, `MapScreen`)
- [x] Standortberechtigungen (Location Permissions) implementiert (`expo-location`,
  `useUserLocation` — Anfrage erst bei Bedarf, kein automatischer Consent beim App-Start)
- [x] Location-Marker und Clustering auf der Karte (natives Mapbox-Clustering, keine zusätzliche
  Bibliothek)

## Community Reports

- [ ] Report-Flow: Nutzer meldet Auslastung einer Location
- [ ] Validierung/Aggregation mehrerer Reports pro Location
- [ ] Anzeige der aktuellen Auslastung basierend auf Reports

## Live Updates

- [x] Supabase-Realtime-Subscriptions für Auslastung/Reports (`RealtimeService.subscribeToReports`,
  zentraler Realtime Service gemäß ADR-003, `reports`-Tabelle per Migration für Realtime aktiviert)
- [x] Live-Aktualisierung der Map/Location-Ansicht ohne manuelles Neuladen (neue Reports aktualisieren
  gezielt die betroffene Location im TanStack-Query-Cache, kein voller Reload)
- [ ] Live-Aktualisierung von Event-/Artist-Daten bei Änderungen (ADR-003 nennt Events/Specials/Happy
  Hours als weitere Realtime-Kandidaten — noch nicht aktiviert, da noch kein Feature sie konsumiert)

## Notifications

- [ ] Firebase Notifications eingerichtet
- [ ] Push-Token-Registrierung mit Supabase verknüpft
- [ ] Benachrichtigungstypen definiert (Favoriten-Update, Event startet bald, Special)
- [ ] Nutzer-Einstellungen für Benachrichtigungen

## Wetter

- [x] Wetter-API-Anbindung ausgewählt (OpenWeather API, über eigenen `WeatherService`)
- [x] Temperatur- und Wetterbedingungs-Anzeige (Home Screen: `WeatherWidget`) — kompakte Anzeige
  (Temperatur, gefühlte Temperatur, Zustand, Luftfeuchtigkeit, Wind); Regenwahrscheinlichkeit/
  UV-Index/Sonnenauf-/-untergang folgen mit dem Wetter-Detailscreen (benötigen die kostenpflichtige
  OpenWeather-One-Call-API); Map-Anzeige nicht Teil dieses Schritts
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
