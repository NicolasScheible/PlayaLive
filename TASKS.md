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
  den `MainDrawerNavigator`, `LocationDetailScreen`, `EventDetailScreen`, `ArtistDetailScreen`,
  `CommunityReportScreen`, `ChangePasswordScreen` und `PermissionsScreen` als Stack-Screens)
- [ ] Bottom Navigation mit 5 Elementen (Home, Map, Community-Report-Schnellzugriff, Events, Profile)
  definiert — siehe `docs/PRD.md` Kapitel 11 (nicht gebaut, siehe finale Drawer-Navigation unten)
- [x] Hamburger-Menü (React-Navigation-Drawer) eingerichtet — `MainDrawerNavigator`
  (`app/src/navigation/MainDrawerNavigator.tsx`) mit den fünf im Drawer-Auftrag festgelegten
  Einträgen **Home, Live Map, Favoriten, Profil, Einstellungen** (`HomeScreen`, `MapScreen`,
  `FavoritesScreen`, `ProfileScreen`, `SettingsScreen` — alle bereits bestehende Screens,
  unverändert wiederverwendet). Da keine Bottom-Tab-Leiste existiert, konsolidiert der Drawer bewusst
  Bottom-Tab- und Hamburger-Menü-Inhalte aus `docs/PRD.md` Kapitel 11 in ein Menü — Artists/Happy
  Hours/Weather/Services/Help/Privacy/About sind nicht enthalten, da diese Screens noch nicht
  existieren. Drawer-Header (`DrawerContent.tsx`) zeigt Avatar/Benutzername/E-Mail aus dem
  bestehenden Auth-/Profile-State (`useProfile()`/`authStore`, kein zusätzlicher Request). Aktiver
  Menüpunkt wird ausschließlich über die Bibliothek selbst (`drawerActiveTintColor`/
  `drawerActiveBackgroundColor`, nur `theme.ts`-Werte) hervorgehoben. Menü-Zugriff über einen neuen,
  optionalen `onPressMenu`-Button in der bestehenden `Header`-Komponente (Hamburger-Glyph „☰" gemäß
  `docs/DesignSystem.md` Kapitel 16), von `HomeScreen` aus verdrahtet.
- [ ] Community-Report-Schnellzugriff-Button (zentrales Bottom-Nav-Element) implementiert — Community
  Report bleibt bewusst außerhalb des Drawers, weiterhin nur programmatisch über die Stack-Route
  erreichbar (Auftrag der Drawer-Navigation: „Community Report NICHT im Drawer anzeigen")
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

## Suche

- [x] Globale Suche über Locations, Events und Artists gleichzeitig — neuer `SearchScreen` (Stack-Route
  `Search`, Einstieg über neues Lupen-Icon im `Header` auf dem Home Dashboard). Da keiner der
  bestehenden Services (`LocationService`/`EventService`/`ArtistService`) serverseitige Textsuche
  unterstützt, lädt `useGlobalSearch` die vollständigen Listen über dieselben Query-Keys wie an anderer
  Stelle bereits etabliert (`['locations','list',{}]`/`['events','list',{}]`/`['artists','list',{}]` —
  Cache-Wiederverwendung mit Home/Favoriten/Profil) und filtert clientseitig nach Name/Titel. Live Search
  mit neuem, feature-übergreifendem `useDebouncedValue`-Hook (`src/hooks/`): leerer Suchtext löst keinen
  Request aus, Requests laufen erst nach Debounce. Getrennte Bereiche (Locations/Events/Künstler), nur
  Bereiche mit Treffern werden angezeigt, Treffer navigieren zu `LocationDetail`/`EventDetail`/
  `ArtistDetail`. Neue generische `SearchResultRow`-Komponente (keine bestehende Zeilen-Komponente war
  generisch genug), sonst ausschließlich bestehende Komponenten (`TextField`, `LoadingState`,
  `ErrorState`, `EmptyState`, `SectionHeader`).

## Map Screen

- [x] Live Map mit Locations (Clubs/Bars) — `MapScreen`, natives Mapbox-Clustering
  (`LocationMarkersLayer`), Filter (Kategorie/Auslastung/geöffnet/Favoriten über `filterStore`),
  Standort (`useUserLocation`, ohne automatische Consent-Abfrage), Zoom Controls, Kompass, Loading-/
  Error-/Empty-State
- [x] Live-Auslastungs-Anzeige pro Location (Leer/Mittel/Voll) — Marker-Farbe + Bottom-Sheet-Badge über
  `location_live_status`, per Realtime aktualisiert (kein kompletter Reload)
- [x] Location-Detailansicht (Öffnungszeiten, Specials, Events) — vollständiger `LocationDetailScreen`:
  Hero-Header (Bild, Scrim, Zurück/Teilen/Favorit, Auslastung, Distanz, Kategorie), Grundinformationen
  inkl. Geöffnet/Geschlossen-Status, Live-Auslastung (Realtime, kein kompletter Reload), aktive Happy
  Hours/Specials, heutige Events (Vorschau, Klick navigiert zum vollständigen `EventDetailScreen`),
  Bewertungen
  (Durchschnitt/Anzahl/Liste, ohne Reviewer-Namen — RLS erlaubt normalen Nutzern nur das Lesen des
  eigenen Profils), Route öffnen/Teilen/Favorit. Website/Telefonnummer bewusst nicht enthalten (Felder
  existieren nicht im Datenmodell, Product-Owner-Entscheidung)
- [x] Community-Review-Feature (Erstellen/Bearbeiten/Löschen/Melden) — eigene Bewertung abgeben über
  neuen `ReviewFormScreen` (Stack-Route `ReviewForm`, Sternebewertung + optionaler Kommentar, gemeinsam
  für Erstellen und Bearbeiten anhand des optionalen `review`-Route-Parameters), Bearbeiten mit
  vorausgefüllten Werten, Löschen als Soft Delete über bestehenden `ReviewService.deleteReview()` mit
  `Alert.alert`-Bestätigungsdialog, Melden fremder Bewertungen über den bestehenden
  `review_flags`-Mechanismus (`ReviewService.flagReview()`) im generischen `BottomSheet`
  (`FlagReviewSheet`). `LocationReviewsSection` um eigene Bewertung
  (Bearbeiten/Löschen-Links) sowie „Melden" bei fremden Bewertungen erweitert; `useLocationReviews`
  leitet `ownReview` ohne zusätzlichen Request aus der bereits geladenen Liste ab. Neue, lokale Hooks
  `useDeleteReview`/`useFlagReview` in `features/locations/` (Feature-Isolation), `useCreateReview`/
  `useUpdateReview` im neuen `features/reviews/`-Modul. Reines UI-/Hook-Feature auf der bereits
  vollständigen Datenschicht (`ReviewService`/`ReviewRepository`/Migration unverändert)

## Events

- [ ] Tagesprogramm-Ansicht
- [ ] Kommende Events
- [x] Event-Detailansicht (Künstler, Startzeit, Location) — vollständiger `EventDetailScreen`:
  Hero-Header (Bild, Scrim, Zurück/Teilen/Favorit, Titel, Datum, Uhrzeit, Kategorie der Location),
  Eventinformationen (Beschreibung, Beginn, Ende, Veranstaltungsort, Distanz — keine
  Altersbeschränkung/Eintritt, da nicht im Datenmodell), Location (wiederverwendete `LocationCard` inkl.
  Live-Auslastung, Klick navigiert zum `LocationDetailScreen`), Künstlerliste (Klick navigiert zum
  vollständigen `ArtistDetailScreen`), aktive Happy Hours/Specials der Location, Route öffnen/Teilen/
  Favorit. Keine Ticket-/Payment-Funktion, keine Reservierungen (explizit ausgeschlossen)

## Artists

- [x] Künstlerprofile (DJs) — vollständiger `ArtistDetailScreen`: Hero-Header (Bild, Scrim, Zurück/
  Teilen/Favorit, Name, Genres), Künstlerinformationen (Biografie, Genres, Social Links — Instagram/
  Spotify/YouTube/TikTok, nur tatsächlich gesetzte URLs; kein Verifizierungs-Status, da kein
  entsprechendes Feld im Datenmodell)
- [x] Auftritte (aktuelle/kommende) pro Künstler — „Aktueller Auftritt" (nur sichtbar, falls laut
  Zeitfenster-Logik von `EventService.getCurrentEvents()` gerade ein Event läuft, inkl. Location, Klick
  navigiert zum `EventDetailScreen`) und „Kommende Events" (Vorschauliste, Klick navigiert ebenfalls zum
  `EventDetailScreen`)
- [x] Künstler favorisierbar — Favoriten-Herz im `ArtistDetailScreen`-Header (`useArtistFavorite`,
  `FavoriteService.toggleFavorite`)

## Favorites

- [x] Locations speichern — Favoriten-Herz im `LocationDetailScreen`-Header (`useLocationFavorite`,
  `FavoriteService.toggleFavorite`); auch bereits als Filter auf der Live-Karte nutzbar
- [x] Events speichern — Favoriten-Herz im `EventDetailScreen`-Header (`useEventFavorite`,
  `FavoriteService.toggleFavorite`)
- [x] Künstler speichern — Favoriten-Herz im `ArtistDetailScreen`-Header (`useArtistFavorite`,
  `FavoriteService.toggleFavorite`)
- [x] Übersicht gespeicherter Favoriten — vollständiger `FavoritesScreen`: Tabs Locations/Events/Artists
  (`FavoritesTabs`), je Tab bestehende `LocationCard`/`EventCard`/`ArtistCard` in vertikaler
  Einspalten-Liste (docs/DesignSystem.md Kapitel 6) mit Favoriten-Herz zum direkten Entfernen
  (optimistisches Update über TanStack Query), Klick navigiert zum jeweiligen Detail-Screen. Als eigene
  Drawer-Route (`Favorites`) registriert; der Einstiegspunkt aus der übrigen Navigation ist seit der
  finalen Drawer-Navigation der `MainDrawerNavigator` (siehe Abschnitt „Navigation"). Locations ohne
  Live-Auslastung (kein Batch-Endpunkt vorhanden,
  hätte einen Report-Request je favorisierter Location erfordert)
- [ ] Benachrichtigungen bei Neuigkeiten zu Favoriten

## Profile

- [x] Profilseite (Nutzerdaten) — vollständiger `ProfileScreen`: Profilbild (bearbeitbar über
  `expo-image-picker` + neuen `StorageService`, Upload in den bereits vorbereiteten `profiles`-Bucket),
  Benutzername (`profiles.display_name` — ein Feld, kein separates „Anzeigename"-Feld im Datenmodell,
  daher nur einmal angezeigt/editierbar), E-Mail (nicht editierbar), Mitglied seit, Trust Score, Anzahl
  Reports/Reviews/Favoriten, eigene Bewertungen (Klick navigiert direkt zur Bearbeitung im
  `ReviewFormScreen`, siehe Community-Review-Feature im Abschnitt „Map Screen"), eigene
  Community Reports. `ReviewService`/`ReviewRepository` um `getOwnReviews()`/`findByUser()` ergänzt
  (analog zu `ReportService.getOwnReports()`, docs/API.md Kapitel 9 aktualisiert). Als eigene
  Drawer-Route (`Profile`) registriert; der Einstiegspunkt aus der übrigen Navigation ist seit der
  finalen Drawer-Navigation der `MainDrawerNavigator` (siehe Abschnitt „Navigation").
- [x] Einstellungen — vollständiger `SettingsScreen` (löst den bisherigen Platzhalter ab): Bereiche
  Konto (Profil bearbeiten → `ProfileScreen`, Passwort ändern → neuer `ChangePasswordScreen` über
  `AuthService.changePassword()`/`supabase.auth.updateUser()`, E-Mail-Verifizierung aus dem bestehenden
  `authStore` ohne zusätzlichen Request, Konto deaktivieren/löschen), App (Sprache, Dark Mode — beide nur
  Anzeige, da weder eine i18n-Bibliothek noch ein Light-Mode dokumentiert sind; Benachrichtigungen
  zunächst als Platzhalter, seit dem Push-Notification-Feature ein echter Ein/Aus-Schalter — siehe
  Abschnitt „Notifications"), Datenschutz (Datenschutzerklärung, Datenexport, Berechtigungen → neuer
  `PermissionsScreen` mit
  Standort-/Fotomediathek-Status über `useUserLocation`/neuen `usePhotoLibraryPermission`-Hook und
  `Linking.openSettings()`), Support (Hilfe, Feedback senden, App bewerten), Rechtliches (Impressum,
  Datenschutz, Nutzungsbedingungen). Konto löschen/deaktivieren, Datenexport sowie alle Einträge ohne
  echte Ziel-URL im Repo (Datenschutzerklärung, Impressum, Nutzungsbedingungen, Hilfe, Feedback senden,
  App bewerten) sind nach Rückfrage beim Product Owner als ehrliche „Demnächst verfügbar"-Hinweise
  umgesetzt (kein Fake-Link, keine stillschweigend erfundene Backend-/DSGVO-Architektur — siehe
  `docs/Architecture.md` Kapitel 17/25, dort selbst als vor der Implementierung zu klärender Punkt
  markiert). `Settings` ist als eigene Drawer-Route registriert (`ChangePassword`/`Permissions` bleiben
  Stack-Routen, von dort aus erreichbar); der Einstiegspunkt aus der übrigen Navigation ist seit der
  finalen Drawer-Navigation der `MainDrawerNavigator` (siehe Abschnitt „Navigation").
- [x] Login/Logout (E-Mail & Passwort über `useAuth()`/`AuthService` — „Abmelden" jetzt im
  `ProfileScreen` statt des bisherigen Main-Platzhalters; Apple Sign-In und Google Sign-In über neue,
  zum bestehenden `AuthService` hinzugefügte `signInWithApple()`/`signInWithGoogle()`-Methoden
  (`supabase.auth.signInWithIdToken()`), angebunden über zwei neue Hooks `useAppleSignIn`/
  `useGoogleSignIn` und native Buttons auf dem `LoginScreen` — siehe Abschnitt „Supabase Backend" für
  die noch offene serverseitige Provider-Konfiguration)

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
  `NotificationService`, `WeatherService`, `StorageService`)
- [x] Edge Function `weather` (`supabase/functions/weather/`) als serverseitiger OpenWeather-Proxy —
  OpenWeather-API-Key muss vor Betrieb per `supabase secrets set OPENWEATHER_API_KEY=...` gesetzt
  werden (siehe `app/README.md` → „Supabase Edge Functions")
- [ ] Auth (E-Mail/Passwort und/oder Social Login) konfiguriert — clientseitig vollständig implementiert
  (E-Mail/Passwort: Login, Registrierung, Passwort-Reset, Session-Handling; Apple Sign-In/Google
  Sign-In: native Anmeldung + `AuthService.signInWithApple()`/`signInWithGoogle()`), serverseitige
  Supabase-Projekt-Konfiguration weiterhin offen: Rate Limits, Redirect-URLs, E-Mail-Templates sowie —
  neu hinzugekommen — die Aktivierung von Apple/Google als Auth-Provider im Supabase-Dashboard
  (inkl. der dafür nötigen Apple-/Google-Developer-Konten und OAuth-Client-IDs, siehe
  `.env.example`) — ohne diese serverseitige Freischaltung lehnt Supabase `signInWithIdToken()`
  weiterhin ab, unabhängig vom bereits vollständigen Client-Code

## Mapbox Integration

- [ ] Mapbox-Account/Token eingerichtet (echtes Produktions-Token — clientseitig bereits über
  `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` vorgesehen, siehe `app/README.md`)
- [x] Karten-Integration in Expo (`@rnmapbox/maps`, `MapScreen`)
- [x] Standortberechtigungen (Location Permissions) implementiert (`expo-location`,
  `useUserLocation` — Anfrage erst bei Bedarf, kein automatischer Consent beim App-Start)
- [x] Location-Marker und Clustering auf der Karte (natives Mapbox-Clustering, keine zusätzliche
  Bibliothek)

## Community Reports

- [x] Report-Flow: Nutzer meldet Auslastung einer Location — vollständiger `CommunityReportScreen`:
  ausgewählte Location (Bild, Name), aktuelle Live-Auslastung + Zeit der letzten Meldung
  (`OccupancyBadge`, Realtime über den bestehenden `RealtimeService`), Entfernung (bestehende
  `distanceMeters`-Utility), Formular mit ausschließlich den drei Auslastungsstufen (Wenig los/Gut
  besucht/Sehr voll — keine Prozentwerte, keine Freitexte), Geofencing-Hinweis/-Sperre clientseitig
  gespiegelt (150 m, serverseitig ohnehin durchgesetzt), Erfolgszustand mit automatischem Rücksprung,
  Fehlerzustände (Geofencing/Rate-Limit/Netzwerk) über die bestehende `ErrorState`. Vollständig über den
  bereits bestehenden `ReportService` (Validierung, Rate Limiting, Geofencing, Trust-Score-Gewichtung
  bleiben serverseitig bzw. im Service, keine neue Logik im Screen). Als eigene Stack-Route
  (`CommunityReport: { locationId }`) registriert; der eigentliche zentrale Schnellzugriff-Button der
  Bottom Navigation (docs/PRD.md Kapitel 11) ist noch nicht Teil dieses Auftrags.
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

- [x] Firebase Notifications eingerichtet — `NotificationService` als einzige Stelle mit Zugriff auf
  `@react-native-firebase/messaging` (ADR-007): Berechtigung anfragen/lesen (iOS über die
  Firebase-API, Android 13+ über `PermissionsAndroid.POST_NOTIFICATIONS`, da die Firebase-Methoden auf
  Android laut SDK-Dokumentation ein No-op sind), Foreground-Anzeige über `Alert`
  (`useForegroundNotifications`, keine Toast-Komponente im Designsystem), Background-/Quit-State-Tap
  löst über den bestehenden `navigationRef` eine Navigation zum passenden, bereits bestehenden
  Detail-Screen aus (`LocationDetail`/`EventDetail`/`ArtistDetail`, `useNotificationListeners`) — keine
  neue Navigation, nur Wiederverwendung der bestehenden Stack-Routen. Background-Handler in `index.ts`
  registriert (Firebase-Vorgabe: außerhalb des React-Lifecycles).
- [x] Push-Token-Registrierung mit Supabase verknüpft — nach Rückfrage beim Product Owner (die
  ursprüngliche `notifications`-Migration hatte dies bewusst offengelassen) über zwei neue, additive
  Spalten auf `profiles` (`push_token`, `push_notifications_enabled`,
  `supabase/migrations/20260805090000_notifications_push_settings.sql`), verwaltet vom
  `NotificationService` (Registrierung beim Einschalten in den Settings, Aktualisierung bei
  Token-Wechsel über `onTokenRefresh`, Entfernung beim Logout in `useAuth`).
- [ ] Benachrichtigungstypen definiert (Favoriten-Update, Event startet bald, Special) — serverseitige
  Erzeugungslogik/Trigger sind nicht Teil dieses Schritts (Auftrag beschränkt auf Empfang/Anzeige/
  Navigation bestehender Notifications), `related_type`/`related_id` unterstützen client-seitig bereits
  Location/Artist/Event.
- [x] Nutzer-Einstellungen für Benachrichtigungen — Settings-Screen, Bereich „App": Ein/Aus-Schalter
  (`useNotificationSettings`, liest/schreibt `push_notifications_enabled` über den bestehenden
  `['home', 'profile']`-Query-Key, keine granularen Typen — Auftrag verlangt explizit nur „Ein/Aus").

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
