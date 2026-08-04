# PlayaLive

## Projektübersicht

PlayaLive ist eine mobile App, die Besuchern der Playa de Palma (Mallorca) in Echtzeit zeigt, was im
Nightlife gerade läuft: Clubs, Bars, Events, Künstler, Auslastung, Öffnungszeiten, Specials und
Community-Meldungen.

Details zu Vision, Zielgruppe und Funktionsumfang: siehe [`PROJECT.md`](./PROJECT.md).

## Ziel der App

Nutzer sollen jederzeit wissen: "Was passiert gerade in Playa de Palma und wo lohnt es sich
hinzugehen?" — anhand von Live-Auslastung, aktuellen Events und Künstlern statt Rumfragen oder Raten.

## Technologien

- **App:** React Native mit Expo, TypeScript
- **Backend:** Supabase (Auth, Postgres-Datenbank, Realtime, Storage)
- **Karten:** Mapbox
- **Notifications:** Firebase Notifications

Der vollständige, begründete Tech-Stack steht in [`PROJECT.md`](./PROJECT.md).

## Entwicklungsphasen

1. **Planung & Grundlage** *(aktuelle Phase)* — Projektdokumentation, Lastenheft, Roadmap
2. **Design** — UI/UX-Konzept, Design-Richtlinien (`docs/Design.md`)
3. **Architektur** — Datenbankmodell (`docs/Database.md`), API-Design (`docs/API.md`)
4. **Expo-Setup** — Projektinitialisierung, Grundstruktur
5. **Navigation & Screens** — Grundnavigation, Kern-Screens
6. **Komponenten** — wiederverwendbare UI-Bausteine
7. **Backend-Integration** — Supabase-Anbindung
8. **Karten-Integration** — Mapbox-Anbindung
9. **Auth** — Registrierung/Login
10. **Notifications** — Push-Benachrichtigungen
11. **Testing** — manuelle und automatisierte Tests
12. **Release** — Store-Vorbereitung und Veröffentlichung

Der detaillierte Fortschritt wird in [`TASKS.md`](./TASKS.md) als Checkliste geführt.

## Setup-Anleitung

> Platzhalter — wird ausgefüllt, sobald das Expo-Projekt aufgesetzt ist (siehe `TASKS.md`).

```bash
# TODO: Voraussetzungen (Node-Version, Expo CLI, etc.)
# TODO: Installation
# TODO: Umgebungsvariablen (.env) — Supabase-, Mapbox- und Firebase-Keys
# TODO: Lokalen Entwicklungsserver starten
```

## Weitere Dokumentation

- [`PROJECT.md`](./PROJECT.md) — Projektbeschreibung, Vision, MVP, Tech-Stack
- [`CLAUDE.md`](./CLAUDE.md) — Arbeits- und Coderegeln für die Entwicklung
- [`TASKS.md`](./TASKS.md) — Entwicklungs-Roadmap als Checkliste
- [`docs/Lastenheft.md`](./docs/Lastenheft.md) — Funktionale/nicht-funktionale Anforderungen
- [`docs/Roadmap.md`](./docs/Roadmap.md) — Zeitliche/inhaltliche Meilensteine
- [`docs/Database.md`](./docs/Database.md) — Datenbankmodell
- [`docs/API.md`](./docs/API.md) — API-Design
- [`docs/Design.md`](./docs/Design.md) — Design-Richtlinien
