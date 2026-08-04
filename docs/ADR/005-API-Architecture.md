# ADR-005: API Architecture

## Status

Accepted

## Datum

2026-08-04

## Kontext

PlayaLive greift aus dem Frontend auf Supabase (Postgres, Auth, Realtime, Storage) zu. Ohne eine
verbindliche Zwischenschicht bestünde die Gefahr, dass Screens/Komponenten direkt mit dem Supabase-
Client kommunizieren, Fehlerbehandlung uneinheitlich implementiert wird und Business-Logik (z. B.
Report-Aggregation, Trust-Score-Berechnung) über die App verstreut statt zentral getestet vorliegt.

## Problemstellung

Wie ist der Datenzugriff im Frontend strukturiert (Service Layer, Repository Pattern), und wie wird
Fehlerbehandlung über alle Services hinweg einheitlich umgesetzt?

## Entscheidung

**Service Layer:** Das Frontend kommuniziert niemals direkt mit Supabase. Sämtlicher Datenzugriff läuft
über benannte Services: `AuthService`, `LocationService`, `EventService`, `ArtistService`,
`FavoriteService`, `ReportService`, `NotificationService`, `WeatherService`, sowie — als zwingende
Konsequenz desselben Musters für die weiteren, im PRD nicht separat benannten Tabellen —
`SpecialService`, `HappyHourService`, `ReviewService`. Jeder Service ist verantwortlich für Datenzugriff,
Mapping auf Domänentypen, Fehlerbehandlung im einheitlichen Format und Bereitstellung für TanStack-
Query-Hooks bzw. Zustand-Actions.

**Repository Pattern (pragmatisch, nicht pauschal):**
- **Mit Repository-Schicht** (Repository kapselt ausschließlich Datenzugriff, Service ausschließlich
  Business-Logik — unabhängig testbar): `ReportService`, `ReviewService`, Trust-Score-Berechnung,
  Community-Aggregation sowie künftige, fachlich anspruchsvolle Business-Logik.
- **Ohne Repository-Schicht** (direkter Supabase-Zugriff im Service): `FavoriteService`,
  `NotificationService`, `LocationService`, `ArtistService`, `EventService`, `SpecialService`,
  `HappyHourService` — solange dort keine nennenswerte Business-Logik entsteht. Eine Repository-Schicht
  kann bei späterem Wachstum eines Services jederzeit nachträglich eingeführt werden.

**Einheitliche Fehlerbehandlung:**
- Zentrale Fehlerbehandlung ausschließlich im Service Layer; Screens/Komponenten enthalten keine eigene
  API-Fehlerlogik.
- Einheitliches `AppError`-Format (`code`, `messageKey`, `technicalMessage`, optional `context` und
  `errorId`) für die gesamte App.
- Domänenstrukturierter Fehlercode-Katalog (z. B. `AUTH_INVALID_CREDENTIALS`, `REPORT_RATE_LIMITED`,
  `NETWORK_OFFLINE`, `SERVER_ERROR`) für präzise, lokalisierte Nutzermeldungen statt generischer Texte.
- Automatische Retries (3 Versuche, exponentieller Backoff 1 s/2 s/4 s) ausschließlich bei temporären
  Netzwerkfehlern; Authentifizierungs-, Berechtigungs-, Validierungs-, Geofencing-, Rate-Limiting- und
  RLS-Fehler werden nie automatisch wiederholt.
- Jeder Screen kennt vier definierte Zustände: Loading, Success, Empty, Error.
- Alle unerwarteten Fehler werden zusätzlich an Sentry übertragen, ausschließlich mit technischen
  Informationen ohne personenbezogene Daten.

## Begründung

Ein durchgängiger Service Layer verhindert, dass Supabase-spezifische Details (Tabellennamen, Query-
Syntax) in die UI-Schicht durchsickern, und macht das Backend bei Bedarf austauschbar. Das pragmatische
Repository Pattern folgt dem in `CLAUDE.md` festgelegten Grundsatz „keine vorzeitigen Abstraktionen": eine
zusätzliche Repository-Schicht wird nur dort eingeführt, wo sie einen nachweisbaren Mehrwert für
Testbarkeit oder Trennung von Datenzugriff und Business-Logik bietet (z. B. bei der komplexen Report-
Aggregation), nicht pauschal für einfache CRUD-Services ohne nennenswerte Business-Logik. Ein einheitliches
`AppError`-Format und ein domänenstrukturierter Fehlercode-Katalog ermöglichen konsistente, verständliche
Nutzermeldungen über die gesamte App hinweg statt Service-spezifischer Ad-hoc-Lösungen. Die Beschränkung
automatischer Retries auf temporäre Netzwerkfehler verhindert sinnlose Wiederholungsversuche bei Fehlern,
die durch erneutes Ausführen ohnehin nicht behoben werden (z. B. fehlende Berechtigung).

## Konsequenzen

- Neue Datenzugriffe werden ausschließlich über einen (neuen oder bestehenden) Service angebunden, nie
  direkt aus einer Komponente heraus.
- Bei der Entwicklung eines neuen Services muss anhand des vorhandenen Business-Logik-Umfangs entschieden
  werden, ob eine Repository-Schicht sinnvoll ist — die bereits getroffene Zuordnung (siehe oben) ist für
  die genannten Services verbindlich und nicht neu zu bewerten.
- Jeder neue Fehlerfall erhält einen eindeutigen, domänenstrukturierten Fehlercode statt eines
  generischen Fehlertexts.
- Screens müssen alle vier Zustände (Loading/Success/Empty/Error) berücksichtigen, auch wenn ein Zustand
  im Erstentwurf selten auftritt.

## Betrachtete Alternativen

- **Direkter Supabase-Zugriff aus Screens/Komponenten:** verworfen, da dies die Trennung von UI und
  Datenzugriff verletzt und das Backend nicht mehr austauschbar wäre.
- **Repository Pattern pauschal für alle Services:** verworfen zugunsten des pragmatischen Ansatzes —
  hätte für einfache CRUD-Services unnötige Abstraktion ohne Mehrwert bedeutet.
- **Kein Repository Pattern für keinen Service:** verworfen, da die komplexe Business-Logik (Report-
  Aggregation, Trust Score) von einer klaren Trennung zwischen Datenzugriff und Logik für unabhängige
  Testbarkeit profitiert.
- **Generische Fehlermeldungen ohne strukturierten Katalog:** verworfen zugunsten präziser, für Nutzer
  verständlicher Fehlermeldungen je Fehlerfall.
- **Automatische Retries für alle Fehlerarten:** verworfen, da dies bei dauerhaften Fehlern (z. B.
  fehlende Berechtigung) zu sinnlosen Wiederholungen führen würde.
- Weitere Details und die vollständige Abwägung sind in `docs/Architecture.md` Kapitel 8, 9 und 15
  dokumentiert.

## Referenzen

- `docs/PRD.md` Kapitel 15 „Technische Architektur" (Service Layer, Fehlerbehandlung)
- `docs/Architecture.md` Kapitel 2 „Architekturprinzipien" (Architekturprinzip 7: Service Layer)
- `docs/Architecture.md` Kapitel 8 „Service Layer"
- `docs/Architecture.md` Kapitel 9 „Repository Pattern" (Architekturentscheidung 5)
- `docs/Architecture.md` Kapitel 15 „Fehlerbehandlung" (inkl. `AppError`-Format/Fehlercode-Katalog/
  Retry-Strategie, Architekturentscheidung 9)
- `docs/Architecture.md` Kapitel 18 „Logging" (Sentry-Anbindung für unerwartete Fehler)
- `docs/DesignSystem.md` — keine direkten Design-Vorgaben zur API-Architektur selbst
- `docs/Database.md` (Tabellen, auf die die Services zugreifen)
- `docs/API.md` Kapitel 1 „Überblick", Kapitel 13 „Fehlerbehandlung"
