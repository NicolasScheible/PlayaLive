# UI Designs — PlayaLive

## Zweck

Dieser Ordner enthält die finalen UI-Designs (Mockups) von PlayaLive. Er ist die zentrale Ablage für
alle visuellen Entwürfe, aus denen `docs/DesignSystem.md` seine konkreten Designwerte ableitet.

## Was hier abgelegt wird

Alle finalen UI-Designs als Bild- oder PDF-Datei: **PNG, JPG oder PDF**. Keine Bearbeitungsdateien
(z. B. `.fig`, `.sketch`, `.xd`) — nur die exportierten, finalen Ansichten.

## Verbindlichkeit

Die hier abgelegten Designs sind die **verbindliche Quelle** für `docs/DesignSystem.md`. Konkrete
Designwerte (Farben, Typografie, Abstände, Komponenten usw.) werden aus diesen Mockups abgeleitet,
nicht angenommen.

**Bei Widersprüchen zwischen Mockups und Textdokumenten (`docs/DesignSystem.md`, `docs/Design.md`,
`docs/PRD.md` usw.) haben die Mockups Vorrang** — es sei denn, eine bewusste Produktentscheidung
dagegen ist explizit dokumentiert (z. B. als spätere, im PRD nachgezogene Entscheidung des Product
Owner).

## Struktur

Ein Ordner pro Screen/Bereich, benannt nach der Screenübersicht aus `docs/PRD.md` Kapitel 10:

- `home/` — Home Dashboard
- `map/` — Live Map, Location-Detailansicht
- `events/` — Event-Übersicht/Tagesprogramm
- `event-details/` — Event-Detailansicht
- `artists/` — Künstlerprofile
- `favorites/` — Favoriten-Übersicht
- `profile/` — Profilseite
- `login/` — Login-/Registrierungs-Flow
- `settings/` — Einstellungen
- `assets/` — Wiederverwendete visuelle Assets (Logo, Icons, Illustrationen), die keinem einzelnen
  Screen zugeordnet sind

Neue Screens, die im Laufe des Projekts hinzukommen, werden hier als zusätzlicher Unterordner ergänzt.

## Nächster Schritt

Sobald die Designs in diesen Ordnern liegen, werden sie gemeinsam analysiert und `docs/DesignSystem.md`
wird auf Basis der tatsächlichen Werte aktualisiert.
