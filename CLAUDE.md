# CLAUDE.md — Arbeitsregeln für Claude in diesem Projekt

Dieses Dokument definiert verbindliche Regeln für jede zukünftige Arbeit von Claude an PlayaLive.
Es ergänzt `PROJECT.md` (Was wir bauen) und `TASKS.md` (Was als Nächstes ansteht).

PlayaLive ist eine **Nightlife-/Event-App für Playa de Palma, Mallorca** — kein allgemeiner
Reise-/Strandguide. Jede Entscheidung (Funktion, Screen, Komponente, Datenmodell) wird an diesem Kontext
gemessen: Live-Auslastung von Clubs/Bars, Events, Künstler, Favoriten, Community Reports, Wetter.

## Grundhaltung

- Erst verstehen, dann ändern. Bestehenden Code/Struktur lesen, bevor etwas Neues hinzugefügt wird.
- Kein Code, solange die Projektgrundlage (docs/, PROJECT.md, Architektur) das nicht hergibt.
- Im Zweifel: kleinere, nachvollziehbare Schritte statt einer großen Änderung.
- **Bestehende Dokumentation ist die Wahrheit.** `PROJECT.md`, `docs/` und `TASKS.md` sind die
  verbindliche Referenz für Scope, Datenmodell und Architektur — nicht Annahmen, nicht Trainingsdaten,
  nicht "wie andere Apps das machen". Bei Widerspruch zwischen Doku und einer Anfrage: Doku gewinnt, bis
  sie explizit geändert wird.
- **Keine Annahmen ohne Rückfrage.** Fehlt eine Information (z. B. unklare Anforderung, fehlendes Feld im
  Datenmodell, unklares Design-Detail), wird nachgefragt statt geraten. Eine begründete Vermutung ist nur
  zulässig, wenn sie explizit als Annahme markiert und zur Bestätigung vorgelegt wird — nie stillschweigend
  als Fakt behandelt.

## Code-Qualität

- TypeScript strikt nutzen, keine `any`-Typen ohne triftigen Grund und Kommentar.
- Keine toten Codepfade, keine auskommentierten Codeblöcke committen.
- Keine Fehlerbehandlung/Validierung für Fälle, die nicht eintreten können — nur an echten
  Systemgrenzen validieren (User-Input, externe APIs, Supabase-Antworten).
- Keine vorzeitigen Abstraktionen oder Hilfsfunktionen "für später" — erst ab echter Wiederverwendung
  (Faustregel: ab 3. Verwendung).
- Lesbarkeit vor Cleverness. Klarer, einfacher Code statt kompakter Tricks.
- Kommentare nur, wenn das *Warum* nicht aus dem Code hervorgeht (z. B. Workaround, nicht-offensichtliche
  Einschränkung). Kein Kommentar, der nur wiederholt, was der Code offensichtlich tut.

## Architekturregeln

- Bestehende Architektur (siehe `docs/PRD.md`, `docs/Architecture.md`, `docs/Database.md`, `docs/API.md`)
  ist verbindlich. Abweichungen nur nach expliziter Absprache und Aktualisierung der Doku.
- Klare Trennung: UI-Komponenten / Screens / Navigation / Datenzugriff (Service Layer über
  Supabase-Client) / State-Management. Keine Vermischung von Datenzugriff direkt in UI-Komponenten ohne
  Abstraktionsschicht.
- Business-Logik gehört nicht in Screens, sondern in dedizierte Module/Hooks.
- Keine neue Abhängigkeit (Library/Package) ohne expliziten Auftrag oder Rücksprache — auch nicht "kleine,
  nützliche" Pakete.
- Keine parallelen Lösungen für dasselbe Problem (z. B. zwei State-Management-Ansätze nebeneinander).
- **Saubere Architektur bleibt Priorität, auch unter Zeitdruck.** Kein "quick and dirty" für Live-Daten-
  Features (Auslastung, Community Reports) nur weil sie zeitkritisch wirken — Echtzeit-Charakter
  rechtfertigt keine Abkürzungen bei Struktur oder Typisierung.
- Live-/Realtime-Datenflüsse (Auslastung, Community Reports, Notifications) werden über dieselbe
  Datenzugriffsschicht wie alle anderen Daten geführt, nicht als Sonderfall am Architekturmuster vorbei.

## Namenskonventionen

- Dateien und Ordner: `kebab-case` für Ordner, `PascalCase` für Komponenten-Dateien (`LocationCard.tsx`),
  `camelCase` für Hooks/Utils-Dateien (`useLocationStatus.ts`).
- Komponenten: `PascalCase` (`LiveMap`, `FavoriteButton`).
- Hooks: Präfix `use` (`useAuth`, `useEventList`).
- Variablen/Funktionen: `camelCase`, sprechende Namen, keine Abkürzungen ohne Not.
- Konstanten (echte Konstanten, kein Konfig-Objekt): `UPPER_SNAKE_CASE`.
- Typen/Interfaces: `PascalCase`, kein `I`-Präfix (`Location`, nicht `ILocation`).
- Fachbegriffe konsistent aus der Domäne übernehmen, wie in `docs/Database.md`/`docs/API.md` definiert
  (z. B. `Location`, `Artist`, `Event`, `Report`, nicht eigene Synonyme erfinden).
- Konsistente Sprache: Code, Variablen- und Funktionsnamen auf Englisch; fachliche/Produkt-Dokumentation
  (`docs/`, `PROJECT.md`) auf Deutsch, sofern nicht anders vereinbart.

## Komponenten-Regeln

- Eine Komponente = eine klar abgegrenzte Verantwortung. Keine "God-Components".
- Screens orchestrieren, wiederverwendbare UI-Bausteine liegen in einem gemeinsamen Komponenten-Ordner.
- **Wiederverwendbarkeit vor Screen-spezifischer Einzellösung:** wiederkehrende UI-Bausteine (Location-
  Card, Auslastungs-Badge, Artist-Card, Event-Card, Favoriten-Button) werden als generische, parametrisierte
  Komponenten gebaut, nicht pro Screen dupliziert.
- Props explizit typisieren, keine impliziten `any`-Props.
- Keine Geschäftslogik/Datenzugriff direkt in rein visuellen Komponenten — über Hooks/Props einreichen.
- Styling einheitlich nach der in `docs/DesignSystem.md` festgelegten Methode (Dark Mode als Basis, Neon-
  Akzente, Premium-Nightlife-Look) — keine Screen-eigenen Ad-hoc-Styles, die vom Designsystem abweichen.

## Premium iOS Design

- Umsetzung folgt konsequent den Design-Richtlinien aus `PROJECT.md`/`docs/Design.md`/
  `docs/DesignSystem.md`: modernes iOS-Design, Dark Mode als Basis, Neon-Akzente, große Cards,
  moderne/reduzierte Navigation.
- Kein generisches Cross-Platform-Look-and-Feel „von der Stange" — die App soll sich hochwertig und
  Nightlife-spezifisch anfühlen, nicht wie eine austauschbare Standard-App.
- Bei UI-Entscheidungen ohne Vorgabe in `docs/DesignSystem.md`: Rückfrage statt eigenmächtiger
  Design-Annahme.

## Vorgehensweise bei Änderungen

1. Kontext lesen: relevante Datei(en), zugehörige Doku (`docs/`), verwandte Komponenten.
2. Kleinstmöglichen Änderungsumfang wählen, der die Aufgabe löst.
3. Bestehende Muster im Projekt wiederverwenden statt neue Muster einzuführen.
4. Nach der Änderung: kurz prüfen, ob Doku (`docs/`, `TASKS.md`) aktualisiert werden muss.
5. Keine Refactorings "nebenbei" außerhalb des Auftragsumfangs — das wird separat vorgeschlagen, nicht
   automatisch mitgemacht.

## Keine unnötigen Dateien erstellen

- Keine neuen Dateien/Ordner ohne klaren Zweck im Rahmen der aktuellen Aufgabe.
- Keine Platzhalter-, Backup- oder "just in case"-Dateien.
- Keine zusätzlichen Markdown-/Notiz-Dateien außerhalb der bestehenden Struktur (`docs/`, Root-Docs), es
  sei denn, es wird explizit verlangt.
- Vor dem Anlegen einer neuen Datei prüfen, ob eine bestehende Datei/Struktur den Zweck bereits erfüllt.

## Bestehende Architektur respektieren

- Keine Struktur, Bibliothek oder Konvention "verbessern", ohne dass danach gefragt wurde.
- Wenn ein Problem mit der bestehenden Architektur auffällt: benennen und vorschlagen, nicht eigenmächtig
  umbauen.
- Dieses Dokument (`CLAUDE.md`) und `PROJECT.md`/`docs/` sind die Referenz — bei Widersprüchen zwischen
  Code und Doku wird das aktiv angesprochen, nicht stillschweigend eine Seite bevorzugt.
