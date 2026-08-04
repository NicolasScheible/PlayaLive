# CLAUDE.md — Arbeitsregeln für Claude in diesem Projekt

Dieses Dokument definiert verbindliche Regeln für jede zukünftige Arbeit von Claude an PlayaLive.
Es ergänzt `PROJECT.md` (Was wir bauen) und `TASKS.md` (Was als Nächstes ansteht).

## Grundhaltung

- Erst verstehen, dann ändern. Bestehenden Code/Struktur lesen, bevor etwas Neues hinzugefügt wird.
- Kein Code, solange die Projektgrundlage (docs/, PROJECT.md, Architektur) das nicht hergibt.
- Im Zweifel: kleinere, nachvollziehbare Schritte statt einer großen Änderung.

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

- Bestehende Architektur (siehe `docs/Database.md`, `docs/API.md`) ist verbindlich. Abweichungen nur nach
  expliziter Absprache und Aktualisierung der Doku.
- Klare Trennung: UI-Komponenten / Screens / Navigation / Datenzugriff (Supabase-Client, API) /
  State-Management. Keine Vermischung von Datenzugriff direkt in UI-Komponenten ohne Abstraktionsschicht.
- Business-Logik gehört nicht in Screens, sondern in dedizierte Module/Hooks.
- Keine neue Abhängigkeit (Library/Package) ohne expliziten Auftrag oder Rücksprache — auch nicht "kleine,
  nützliche" Pakete.
- Keine parallelen Lösungen für dasselbe Problem (z. B. zwei State-Management-Ansätze nebeneinander).

## Namenskonventionen

- Dateien und Ordner: `kebab-case` für Ordner, `PascalCase` für Komponenten-Dateien (`BeachCard.tsx`),
  `camelCase` für Hooks/Utils-Dateien (`useBeachStatus.ts`).
- Komponenten: `PascalCase` (`BeachMap`, `CheckInButton`).
- Hooks: Präfix `use` (`useAuth`, `useBeachList`).
- Variablen/Funktionen: `camelCase`, sprechende Namen, keine Abkürzungen ohne Not.
- Konstanten (echte Konstanten, kein Konfig-Objekt): `UPPER_SNAKE_CASE`.
- Typen/Interfaces: `PascalCase`, kein `I`-Präfix (`Beach`, nicht `IBeach`).
- Konsistente Sprache: Code, Variablen- und Funktionsnamen auf Englisch; fachliche/Produkt-Dokumentation
  (`docs/`, `PROJECT.md`) auf Deutsch, sofern nicht anders vereinbart.

## Komponenten-Regeln

- Eine Komponente = eine klar abgegrenzte Verantwortung. Keine "God-Components".
- Screens orchestrieren, wiederverwendbare UI-Bausteine liegen in einem gemeinsamen Komponenten-Ordner.
- Props explizit typisieren, keine impliziten `any`-Props.
- Keine Geschäftslogik/Datenzugriff direkt in rein visuellen Komponenten — über Hooks/Props einreichen.
- Styling einheitlich nach der in `docs/Design.md` festgelegten Methode (wird in der Design-Phase
  festgelegt, danach verbindlich).

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
