# ADR-001: State Management

## Status

Accepted

## Datum

2026-08-04

## Kontext

PlayaLive benötigt in der React-Native/Expo-App eine klare Trennung zwischen Daten, die vom Backend
(Supabase) geladen werden, globalem clientseitigem UI-Zustand und lokalem Komponentenzustand. Ohne eine
verbindliche Zuständigkeitstrennung besteht die Gefahr, dass Backend-Daten redundant in mehreren State-
Containern gehalten werden, Caching- und Realtime-Synchronisation uneinheitlich implementiert werden und
Komponenten direkt auf den Supabase-Client zugreifen.

## Problemstellung

Welcher State-Management-Ansatz wird für PlayaLive Version 1.0 verwendet, und wie werden Server-State,
globaler Client-State, lokaler Komponentenstatus und Realtime-Daten voneinander abgegrenzt?

## Entscheidung

PlayaLive verwendet drei parallele, klar abgegrenzte State-Mechanismen, ergänzt um Supabase Realtime zur
automatischen Cache-Aktualisierung:

- **TanStack Query** für Server State: sämtliche vom Backend geladenen Daten (Locations, Events,
  Künstler, Wetter, Favoriten, Specials, Happy Hours, Reviews, Detailansichten). Übernimmt Datenabruf,
  Caching, Background Refresh, Optimistic Updates, Fehlerbehandlung und Synchronisation mit Supabase.
- **Zustand** für globalen Client State: ausschließlich globaler UI-/Client-Zustand ohne dauerhafte
  Backend-Daten (Login-Status, aktive Filter, Suchbegriffe, Kartenstatus, Theme, Sprache, Einstellungen,
  Bottom-Navigation-Zustand). Umgesetzt als mehrere themenbezogene Stores mit klar definierter
  Verantwortung (z. B. `authStore`, `uiStore`, `filterStore`, `mapStore`, `settingsStore`) statt eines
  einzelnen globalen Stores.
- **React State** für lokalen Komponentenstatus (Modals, Inputs, Animationen, Ladezustände, Formulare),
  ausschließlich über React Hooks.
- **Supabase Realtime** aktualisiert automatisch den TanStack-Query-Cache für zeitkritische Daten
  (Community Reports/Live-Auslastung, Notifications, Events, Specials & Happy Hours) über einen
  zentralen Realtime Service — siehe ADR-003.

TanStack-Query-Keys folgen einer einheitlichen, hierarchischen Struktur (z. B. `['locations','list',
filters]`, `['locations','detail',id]`, `['events','today']`, `['artists','detail',id]`,
`['reviews','location',locationId]`). Cache-Invalidierung erfolgt nach Mutationen gezielt per
`invalidateQueries`, nicht durch vollständige Cache-Resets.

Grundprinzip: globaler Zustand ausschließlich über Zustand, Serverdaten ausschließlich über TanStack
Query — die Verantwortlichkeiten werden niemals vermischt. Kein direkter Datenbankzugriff aus Screens/
Komponenten; wiederverwendbare Custom Hooks kapseln die Kommunikation zwischen UI und Service Layer.

## Begründung

TanStack Query und Zustand lösen unterschiedliche, nicht überlappende Probleme: TanStack Query ist auf
asynchrone Server-Daten mit Caching/Synchronisation spezialisiert, Zustand auf einfachen, performanten
globalen UI-Zustand ohne den Boilerplate klassischer Redux-Ansätze. Die Kombination vermeidet sowohl das
Zweckentfremden von TanStack Query für reinen UI-Zustand als auch das manuelle Nachbauen von Caching-
Logik in einem generischen Store. Mehrere themenbezogene Zustand-Stores statt eines einzelnen globalen
Stores halten die Verantwortlichkeiten klar abgegrenzt und vermeiden einen unübersichtlichen
"God-Store". Die genaue Begründung wurde im Rahmen der strukturierten Klärungsrunden mit dem Product
Owner (PRD-Klärung 8, Architekturentscheidung 6) erarbeitet.

## Konsequenzen

- Neue Backend-Daten werden ausschließlich über TanStack Query angebunden, niemals dauerhaft in einem
  Zustand-Store dupliziert.
- Neue globale UI-Zustände werden einem passenden thematischen Zustand-Store zugeordnet; bei Bedarf wird
  ein neuer, klar abgegrenzter Store ergänzt statt einen bestehenden zweckzuentfremden.
- Realtime-Updates laufen ausschließlich über den zentralen Realtime Service, der den TanStack-Query-
  Cache aktualisiert (siehe ADR-003) — kein paralleler Realtime-Zugriff aus Komponenten.
- Die konkrete Aufteilung der Zustand-Stores sowie das Query-Key-Schema sind verbindlich und bei neuen
  Features weiterzuführen, nicht neu zu erfinden.

## Betrachtete Alternativen

- **Redux (mit oder ohne Redux Toolkit):** verworfen zugunsten von Zustand — deutlich mehr Boilerplate
  für die vergleichsweise einfachen globalen UI-Zustände von PlayaLive, kein Zusatznutzen gegenüber
  Zustand für den vorgesehenen Umfang.
- **Ausschließlich React Context/React State ohne dedizierte State-Library:** verworfen, da für
  serverseitige Daten (Caching, Background Refresh, Optimistic Updates) und komplexeren globalen
  Zustand nicht ausreichend performant/wartbar.
- **Ein einzelner globaler Zustand-Store statt mehrerer themenbezogener Stores:** verworfen zugunsten
  klar abgegrenzter Verantwortlichkeiten und besserer Wartbarkeit.
- Weitere geprüfte Optionen und die vollständige Abwägung sind in `docs/Architecture.md` Kapitel 10
  dokumentiert.

## Referenzen

- `docs/PRD.md` Kapitel 15 „Technische Architektur" (State-Management-Grundentscheidung, Klärung 8)
- `docs/Architecture.md` Kapitel 10 „State Management (TanStack Query + Zustand)"
- `docs/Architecture.md` Kapitel 11 „Realtime-Architektur" (Cache-Aktualisierung durch Supabase Realtime)
- `docs/Architecture.md` Kapitel 25, Punkt 6 (offene Detailfrage: konkrete i18n-Bibliothek — nicht Teil
  dieser Entscheidung)
- `docs/DesignSystem.md` — keine direkten Design-Vorgaben zu State Management
- `docs/Database.md` — Datenmodell, das über TanStack Query abgerufen wird
- `docs/API.md` Kapitel 12 „Realtime-Subscriptions" (Zusammenspiel mit dem Service Layer)
