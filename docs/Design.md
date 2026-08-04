# Design — PlayaLive

> Status: Die grundlegenden Design-Prinzipien dieses Dokuments wurden vollständig in
> `docs/DesignSystem.md` übernommen und dort mit konkreten, aus den finalen UI-Designs abgeleiteten
> Werten hinterlegt (Farbpalette, Typografie-Hierarchie, Icon-Stil, Komponenten, Spacing-Muster u. a.).
> `docs/DesignSystem.md` ist die verbindliche, aktuelle Referenz für alle Design-Entscheidungen — dieses
> Dokument bleibt als kurze Prinzip-Übersicht bestehen, dupliziert aber keine Inhalte mehr.

## Design-Prinzipien

Siehe `docs/DesignSystem.md` Kapitel 1 „Designphilosophie" sowie `docs/PRD.md` Kapitel 17 „Design".

Kernpunkte: modernes iOS-Design mit Premium-Nightlife-Look, **ausschließlich Dark Mode** (kein Light
Mode, weder in v1.0 noch in späteren Versionen), Neon-Markenfarbe getrennt von den Auslastungs-
Statusfarben, große Karten (Cards) als zentrales Content-Element, moderne reduzierte Navigation, dezente
Glas-/Blur-Effekte, hochwertige Animationen, einheitliche Abstände, konsistente Komponenten.

## Konkrete Design-Werte

Farbpalette (inkl. Hex-Werte), Typografie, Iconografie, Spacing, Border Radius, Komponenten-Bibliothek,
Interaktion/Animation und Barrierefreiheit: siehe `docs/DesignSystem.md` (Kapitel 3–24). Verbleibende
offene Designentscheidungen (z. B. exakte px-Maße, Schriftfamilie) sind dort in Kapitel 25 gesammelt.

## Screens & Wireframes

Screenübersicht auf Konzeptebene: `docs/PRD.md` Kapitel 10. Die tatsächlichen UI-Design-Mockups liegen
in `docs/ui-designs/`.

## Dark Mode / Light Mode

Verbindliche Entscheidung: PlayaLive verwendet **ausschließlich Dark Mode**, kein Light Mode — weder in
Version 1.0 noch in späteren Versionen. Dark Mode ist zentraler Bestandteil der Markenidentität
(Premium-Nightlife-Look), kein optionales Merkmal. Es wird kein zweites Farbschema implementiert.
