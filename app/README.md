# PlayaLive — App

Expo-/React-Native-App (TypeScript). Technisches Setup gemäß `docs/Architecture.md` — siehe dort für
die vollständige Architektur, Ordnerstruktur (Kapitel 5) und Begründungen.

## Voraussetzungen

- Node.js (Version passend zur installierten Expo-SDK-Version, siehe `package.json`)
- Für native Builds (nicht für Entwicklung mit Expo Go erforderlich): Xcode (iOS) bzw. Android
  Studio (Android)

## Setup

```bash
npm install
cp .env.example .env.local
# .env.local mit echten Werten der jeweiligen Umgebung befüllen (siehe unten)
npm start
```

## Umgebungsvariablen

Siehe `.env.example`. Secrets-Strategie: `docs/ADR/008-Security.md`, `docs/Architecture.md` Kapitel 17. Lokal über `.env.local` (nicht versioniert), in CI/CD und Builds über Expo EAS Secrets.

## Native Konfiguration (vor dem ersten nativen Build erforderlich)

Die folgenden Dateien enthalten projektspezifische Zugangsdaten und werden **nicht** versioniert
(siehe `.gitignore`). Sie müssen vor einem echten nativen Build (`expo prebuild`/EAS Build) ergänzt
werden — für die Arbeit mit Expo Go bzw. reine JavaScript-/Komponentenentwicklung sind sie nicht
erforderlich:

- **Firebase Notifications** (`docs/ADR/007-Notifications.md`): `google-services.json` (Android) im
  Ordner `app/`, `GoogleService-Info.plist` (iOS) im Ordner `app/`, jeweils aus der Firebase-Konsole
  des zugehörigen Projekts.
- **Mapbox** (`docs/ADR/006-Maps.md`): `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` (öffentlicher Access Token,
  siehe `.env.example`) sowie ein Mapbox-Downloads-Token für den nativen Build (als
  `RNMapboxMapsDownloadToken` im `@rnmapbox/maps`-Plugin-Eintrag in `app.json`, sobald vorhanden).

## Supabase Edge Functions

Die Edge Function `weather` (`supabase/functions/weather/`) ist ein serverseitiger Proxy zu
OpenWeather (siehe `docs/PRD.md` Kapitel 15 „Wetter-API": Wetterdaten werden nie direkt aus dem
Frontend abgefragt). Sie benötigt einen OpenWeather-API-Key als Supabase-Secret — **kein**
`EXPO_PUBLIC_`-Client-Wert, da der Key ausschließlich serverseitig verwendet wird:

```bash
supabase secrets set OPENWEATHER_API_KEY=<dein-openweather-api-key>
```

Ohne gesetztes Secret liefert die Function `503 WEATHER_NOT_CONFIGURED` — das Wetter-Widget im
Home Dashboard zeigt in diesem Fall seinen Fehlerzustand statt Daten.

## Verfügbare Scripts

| Script                                            | Zweck                                                      |
| ------------------------------------------------- | ---------------------------------------------------------- |
| `npm start`                                       | Expo-Entwicklungsserver starten                            |
| `npm run android` / `npm run ios` / `npm run web` | App auf Plattform starten                                  |
| `npm run lint` / `npm run lint:fix`               | ESLint prüfen/beheben                                      |
| `npm run format` / `npm run format:check`         | Prettier anwenden/prüfen                                   |
| `npm run typecheck`                               | TypeScript ohne Build prüfen                               |
| `npm test`                                        | Unit-/Component-Tests (Jest, React Native Testing Library) |
| `npm run test:e2e`                                | E2E-Tests (Maestro, siehe `.maestro/README.md`)            |

Ein Pre-Commit-Hook (Husky + lint-staged) führt ESLint und Prettier automatisch auf gestagten
Dateien aus.

## Ordnerstruktur

Siehe `docs/Architecture.md` Kapitel 5 „Ordnerstruktur (innerhalb des App-Codes)" für die
vollständige, verbindliche Struktur unter `src/`.
