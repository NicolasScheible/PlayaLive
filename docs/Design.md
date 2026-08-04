# Design — PlayaLive

> Status: Grundprinzipien mit dem Product Owner abgestimmt und verbindlich (siehe `docs/PRD.md` Kapitel
> 17). Konkrete Werte (Hex-Farbcodes, Typografie, Iconografie, Spacing, Komponenten-Bibliothek,
> Animationen, Accessibility-Details) folgen im geplanten Dokument `docs/DesignSystem.md` (siehe
> `docs/PRD.md` Kapitel 21), das gemeinsam mit dem Product Owner ausgearbeitet wird und sich an bereits
> vorhandenen UI-Design-Entwürfen orientiert.

## 1. Design-Prinzipien

- Modernes iOS-Design
- **Dark Mode als einziger Modus** — kein Light Mode, weder in v1.0 noch in späteren Versionen (siehe
  Kapitel 10)
- Neon-Akzente
- Premium-Nightlife-Look
- Große Karten (Cards) für Locations, Events, Künstler
- Moderne, reduzierte Navigation
- Dezente Glas-/Blur-Effekte, hochwertige Animationen, einheitliche Abstände, konsistente Komponenten

## 2. Farbpalette

Prinzip (verbindlich, siehe `docs/PRD.md` Kapitel 17):

- Eine dominante **Markenfarbe** (Neon-Akzent) ausschließlich für Branding, Logo, primäre Buttons, CTAs,
  aktive Navigation und Hervorhebungen.
- **Statusfarben** für die Auslastungsanzeige — unabhängig von der Markenfarbe, damit Zustände
  (🟢 wenig los / 🟡 gut besucht / 🔴 sehr voll) jederzeit eindeutig erkennbar bleiben.
- Weitere Akzentfarben nur unterstützend (Hinweise, Wetter, Services, Icons).

_TODO — konkrete Hex-Werte folgen in `docs/DesignSystem.md`._

## 3. Typografie

_TODO — folgt in `docs/DesignSystem.md`._

## 4. Iconografie

_TODO — folgt in `docs/DesignSystem.md`._

## 5. Spacing & Layout-Raster

_TODO — folgt in `docs/DesignSystem.md`._

## 6. Komponenten-Bibliothek

_TODO — folgt in `docs/DesignSystem.md`._

## 7. Screens & Wireframes

_TODO — u. a. Home (inkl. Party Radar), Live Map, Location-Detail (Club/Bar), Event-Übersicht,
Künstlerprofil, Favoriten, Community-Report-Flow. Screenübersicht auf Konzeptebene: siehe `docs/PRD.md`
Kapitel 10._

## 8. Interaktion & Animation

_TODO — folgt in `docs/DesignSystem.md`._

## 9. Barrierefreiheit (Accessibility)

_TODO — folgt in `docs/DesignSystem.md`. Grundsatz: hohe Kontraste und klare Lesbarkeit gelten auch im
Dark-Mode/Neon-Look (siehe `docs/PRD.md` Kapitel 17)._

## 10. Dark Mode / Light Mode

Verbindliche Entscheidung: PlayaLive verwendet **ausschließlich Dark Mode**. Ein Light Mode ist weder für
Version 1.0 noch für spätere Versionen geplant — Dark Mode ist zentraler Bestandteil der Markenidentität
(Premium-Nightlife-Look), kein optionales Merkmal. Es wird kein zweites Farbschema implementiert; das
Design System definiert ausschließlich eine Dark-Mode-Farbpalette.
