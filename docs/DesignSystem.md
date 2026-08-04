# DesignSystem — PlayaLive

> Status: Erste Fassung des Design Systems, aufbauend auf `docs/PRD.md` (insbesondere Kapitel 17
> „Design"), `docs/Design.md`, `docs/Architecture.md` und `CLAUDE.md`. Dieses Dokument erfindet **keine
> neuen Produktfunktionen** — es bündelt und operationalisiert ausschließlich bereits getroffene
> Design-Prinzipien für die konkrete UI-Umsetzung.
>
> **Wichtiger Hinweis zu den referenzierten UI-Designs:** `docs/PRD.md` Kapitel 17 vermerkt, dass sich
> das Farbkonzept „an den bereits vorhandenen UI-Design-Entwürfen" orientieren soll. In diesem Repository
> sind jedoch **keine** Bild-, Figma- oder sonstigen Entwurfsdateien vorhanden (geprüft: keine `.png`/
> `.jpg`/`.svg`/Figma-Referenzen im Repository außer diesem Dokumentationsordner). Dieses Dokument kann
> sich deshalb ausschließlich auf die bereits **textuell** getroffenen Design-Entscheidungen stützen.
> Sämtliche konkreten Werte (Hex-Farben, Schriftgrößen, Abstände px, Radien px etc.), die aus keinem
> bestehenden Dokument hervorgehen, sind unten explizit als 🔴 offene Designentscheidung markiert statt
> angenommen. Sobald die erwähnten UI-Design-Entwürfe als Datei verfügbar sind, sollten diese Punkte in
> einer eigenen Runde nachgezogen werden.
>
> **Legende:**
> - ✅ **Entschieden** — direkt aus `docs/PRD.md`, `docs/Design.md`, `docs/Architecture.md` oder
>   `CLAUDE.md` übernommen.
> - 🟡 **Abgeleiteter Vorschlag (zur Bestätigung)** — folgt aus bereits entschiedenen Prinzipien oder aus
>   dem bestehenden Datenmodell/Screenumfang, wurde aber nirgends wörtlich als Designwert festgelegt.
> - 🔴 **Offene Designentscheidung** — kein Beleg in bestehender Dokumentation, keine Werte vorhanden.
>
> Eine gesammelte Liste aller 🔴-Punkte steht in Kapitel 25 „Zusammenfassung".

## 1. Designphilosophie

✅ Entschieden (`docs/PRD.md` Kapitel 17, `docs/Design.md` Kapitel 1, `PROJECT.md` → Design-Richtlinien):

- Modernes iOS-Design mit **Premium-Nightlife-Look** — PlayaLive soll sich hochwertig und
  nightlife-spezifisch anfühlen, nicht wie eine austauschbare Standard-App.
- **Nur Dark Mode** — kein Light Mode, weder in v1.0 noch in späteren Versionen. Dark Mode ist zentraler
  Bestandteil der Markenidentität, kein optionales Merkmal (siehe Kapitel 2).
- Große, klare Karten (Cards) für Locations, Events, Künstler statt kompakter Listenzeilen.
- Moderne, reduzierte Navigation.
- Dezente Glas-/Blur-Effekte, hochwertige Animationen, einheitliche Abstände, konsistente Komponenten.
- Mobile-first, große Touch-Ziele, viel visuelle Information (Karte, Icons, Badges für Auslastung).
- Barrierefreiheit (Kontraste, Lesbarkeit) wird auch im Dark-Mode/Neon-Look aktiv mitgedacht, nicht als
  nachträglicher Kompromiss.
- Performance: Karte und Live-Daten müssen auch bei schlechter mobiler Verbindung nutzbar bleiben.

## 2. Markenidentität

✅ Entschieden: PlayaLive positioniert sich als **die zentrale, hochwertige Live-Plattform für das
Nightlife an der Playa de Palma** (`docs/PRD.md` Kapitel 1) — nicht als generische Reise-/Party-App.
Die Markenidentität stützt sich auf drei Säulen:

1. **Dark Mode als Markenzeichen**, nicht nur Stilmittel (Kapitel 1).
2. **Eine dominante Markenfarbe** (Neon-Akzent) als visueller Wiedererkennungswert — konsistent
   eingesetzt für Branding, Logo, primäre Buttons, CTAs, aktive Navigation und Hervorhebungen
   (`docs/PRD.md` Kapitel 17).
3. **Statusfarben als eigenständiges, von der Marke unabhängiges System** für die Live-Auslastung
   (🟢/🟡/🔴, siehe Kapitel 19) — sie dürfen die Markenfarbe nicht verwässern und werden nie für
   Branding-Zwecke verwendet.

🔴 **Offene Designentscheidung:** Markenname-Schreibweise/Logo-Wortmarke, Icon/App-Icon-Gestaltung,
Tonalität von UI-Texten (Microcopy-Stil), konkreter Hex-Wert der Markenfarbe.

## 3. Farbpalette

✅ Entschieden (Prinzip-Ebene, `docs/PRD.md` Kapitel 17):

- Eine dominante **Markenfarbe** (Neon-Akzent) ausschließlich für Branding, Logo, primäre Buttons, CTAs,
  aktive Navigation, Hervorhebungen.
- **Statusfarben** für die Auslastungsanzeige, unabhängig von der Markenfarbe: 🟢 wenig los / 🟡 gut
  besucht / 🔴 sehr voll (siehe Kapitel 19).
- Weitere Akzentfarben nur unterstützend (Hinweise, Wetter, Services, Icons) — die Markenfarbe bleibt
  immer dominant.
- Hoher Kontrast vor dem dunklen Hintergrund, Lesbarkeit hat Vorrang (Kapitel 1, Kapitel 22).

🟡 **Abgeleiteter Vorschlag** (Token-Struktur, keine Werte): ein späteres Farbsystem sollte mindestens
folgende Kategorien als benannte Design-Tokens abbilden, damit Komponenten nie mit Rohwerten arbeiten
(konsistent mit `docs/Architecture.md` Kapitel 5 „Ordnerstruktur" → `theme/`):

| Token-Kategorie | Zweck |
|---|---|
| `color.background.*` | Basis-Hintergrund (Dark Mode), abgestufte Ebenen für Cards/Sheets/Overlays |
| `color.brand.primary` | Markenfarbe (Buttons, CTAs, aktive Navigation, Branding) |
| `color.status.low` / `.medium` / `.high` | Auslastungs-Statusfarben (🟢/🟡/🔴) |
| `color.text.primary` / `.secondary` / `.disabled` | Textfarben auf dunklem Hintergrund |
| `color.accent.info` / `.weather` / `.sponsored` | Unterstützende Akzente (Hinweise, Wetter, „Gesponsert"-Kennzeichnung, siehe `docs/PRD.md` Kapitel 13) |
| `color.border` / `.divider` | Trennlinien, Card-Ränder |

🔴 **Offene Designentscheidung:** sämtliche konkreten Hex-/RGB-Werte für alle Tokens oben, exakte Anzahl
der Hintergrund-Ebenen (Elevation-System), Kontrastverhältnisse (siehe Kapitel 22).

## 4. Typografie

🔴 **Offene Designentscheidung.** In keinem bestehenden Dokument ist eine Schriftart, ein Type-Scale
oder eine Gewichtsstufung festgelegt (`docs/Design.md` Kapitel 3 ist als `_TODO_` markiert). Zu klären:

- Schriftfamilie (System-Font wie SF Pro/Roboto vs. individuelle Font)
- Type-Scale (Größen für Headline/Title/Body/Caption etc.)
- Schriftschnitte/Gewichte (Regular/Medium/Semibold/Bold) und deren Einsatzregeln
- Zeilenhöhen, Letter-Spacing
- Wie sich „modernes iOS-Design" (Kapitel 1) typografisch ausdrückt

## 5. Spacing-System

🔴 **Offene Designentscheidung.** `docs/PRD.md` Kapitel 17 und `docs/Design.md` Kapitel 1 fordern
„einheitliche Abstände" nur als Prinzip, ohne konkrete Skala. Zu klären: Basis-Einheit (z. B. 4pt- oder
8pt-Raster als verbreitete Konvention — hier nicht vorentschieden), Abstufungen (z. B.
xs/sm/md/lg/xl), Anwendung auf Card-Innenabstände, Abstände zwischen Cards/Listenelementen,
Screen-Ränder.

## 6. Grid-System

🔴 **Offene Designentscheidung.** Kein Layout-Grid ist definiert. Zu klären: Spaltenanzahl/-verhalten
für Card-Grids (z. B. Locations-/Events-Übersicht), Gutter-Breiten, Verhalten bei unterschiedlichen
Gerätebreiten (siehe auch Kapitel 23 „Responsive Verhalten").

## 7. Border Radius

🔴 **Offene Designentscheidung.** Kein konkreter Radius-Wert ist festgelegt. Betrifft insbesondere
Cards (Kapitel 12, dort als „groß" und „klar" beschrieben, aber ohne Radius-Wert), Buttons (Kapitel 11),
Inputs (Kapitel 13), Badges/Chips (Kapitel 14/15), Bottom Sheets (Kapitel 17).

## 8. Schatten

🔴 **Offene Designentscheidung.** Kein Schatten-/Elevation-System ist dokumentiert. Zu klären: ob
Schatten oder ausschließlich Farbebenen (dunkler Hintergrund mit helleren Card-Flächen) zur
Tiefenwirkung genutzt werden, Schattenfarbe/-stärke je Elevation-Stufe.

## 9. Blur- und Glassmorphism-Effekte

✅ Entschieden (Prinzip-Ebene, `docs/PRD.md` Kapitel 17): „Dezente Glas-/Blur-Effekte" sind Teil der
visuellen Sprache — explizit **dezent**, nicht dominant.

🔴 **Offene Designentscheidung:** wo genau Blur-/Glass-Effekte eingesetzt werden (z. B. Tab-Bar,
Bottom Sheets, Modal-Hintergründe, Header beim Scrollen), konkrete Blur-Radius-/Transparenzwerte.

## 10. Icons

🔴 **Offene Designentscheidung.** `docs/Design.md` Kapitel 4 „Iconografie" ist als `_TODO_` markiert.
Zu klären: Icon-Bibliothek/-Stil (z. B. Outline vs. Filled, System-Icons vs. individuelles Set),
Icon-Größenraster, Icon-Farbregeln (wann Markenfarbe, wann neutrale Textfarbe).

🟡 **Abgeleiteter Vorschlag (nur Bedarf, keine Gestaltung):** aus dem bereits entschiedenen
Feature-Umfang (`docs/PRD.md` Kapitel 7/10) ergibt sich mindestens Bedarf für Icons zu: Navigation
(Home/Map/Events/Artists/Favorites/Profile), Auslastungsstatus, Favoriten (aktiv/inaktiv), Wetter,
Benachrichtigungen, Standort/Geofencing-Hinweis, Kategorie-/Genre-Filter, Login-Methoden (Apple/Google/
E-Mail-Icon).

## 11. Buttons

✅ Entschieden (Teilaspekt): primäre Buttons verwenden die Markenfarbe (`docs/PRD.md` Kapitel 17).

🔴 **Offene Designentscheidung:** Button-Varianten (primary/secondary/tertiary/destructive), Button-
Größen, Zustände (default/pressed/disabled/loading), Icon-Button-Stil, konkrete Maße (Höhe, Padding,
Radius — siehe Kapitel 7).

🟡 **Abgeleiteter Bedarf:** aus bereits entschiedenen Flows ergeben sich mindestens: Login-Buttons
(Apple Sign-In, Google Sign-In, E-Mail-Login — `docs/PRD.md` Kapitel 12), Favoriten-Button (als eigene,
generische Komponente bereits in `CLAUDE.md`/`docs/Architecture.md` Kapitel 22 benannt), Report-Absenden-
Button (Community-Report-Flow), CTA-Buttons auf Cards (z. B. „Details ansehen").

## 12. Cards

✅ Entschieden (Prinzip, `docs/PRD.md` Kapitel 17): große, klare Karten für Locations, Events und
Künstler; als generische, parametrisierte Komponenten gebaut, nicht pro Screen dupliziert
(`CLAUDE.md`/`docs/Architecture.md` Kapitel 22).

🟡 **Abgeleiteter Inhaltsbedarf** je Card-Typ, hergeleitet aus dem entschiedenen Datenmodell
(`docs/Database.md`) — keine neue Funktion, nur Übersetzung bestehender Felder in UI-Inhalt:

| Card | Mindestinhalt (aus Datenmodell) |
|---|---|
| `LocationCard` | Name, Kategorie, Bild, Auslastungs-Badge (Kapitel 14), Favoriten-Button |
| `EventCard` | Titel, Location, Start-/Endzeit, Bild, beteiligte Artists, ggf. „Gesponsert"-Badge |
| `ArtistCard` | Name, Bild, Genre(s), Favoriten-Button |
| `SpecialCard` / `HappyHourCard` | Titel, Location, Gültigkeitszeitraum bzw. Wochentag/-zeit, ggf. „Gesponsert"-Badge |

🔴 **Offene Designentscheidung:** konkrete Card-Maße, Innenabstände, Bildausschnitt/-verhältnis
(Aspect Ratio), Radius, Schatten/Elevation, Verhalten bei fehlendem Bild (Placeholder, siehe Kapitel 21).

## 13. Inputs

🔴 **Offene Designentscheidung.** Kein Input-Stil ist dokumentiert (Rahmen vs. gefüllt, Label-Position,
Fehlerzustand-Darstellung, Fokus-Zustand).

🟡 **Abgeleiteter Bedarf:** E-Mail-/Passwort-Felder (Login/Registrierung, `docs/PRD.md` Kapitel 12),
Suchfeld (Locations/Events/Artists), Community-Report-Eingabe (Auslastung/Wartezeit/Stimmung als
Auswahl, kein Freitext laut Datenmodell — `docs/Database.md` 2.10), ggf. Freitext für Reviews/Comments
(Detailstruktur laut `docs/PRD.md` Kapitel 22 „Offene Punkte" noch nicht geklärt).

## 14. Badges

✅ Entschieden (Bedarf, nicht Gestaltung): Auslastungs-Badge ist bereits als eigene, wiederverwendbare
Komponente benannt (`CLAUDE.md`, `docs/Architecture.md` Kapitel 22); `PROJECT.md` → Design-Richtlinien
nennt „Badges für Auslastung" explizit. Zusätzlich benötigt: „Gesponsert"-Kennzeichnung, da alle
bezahlten Inhalte transparent gekennzeichnet werden müssen (`docs/PRD.md` Kapitel 13).

🔴 **Offene Designentscheidung:** visuelle Gestaltung der Badges (Form, Größe, Farbnutzung über die drei
Statusfarben hinaus), Darstellung des Vertrauenslevels (`docs/PRD.md` nennt beispielhaft „🌱 Neues
Mitglied" / „⭐ Vertrauenswürdig" / „🌟 Erfahrenes Mitglied" / „👑 Top-Mitglied" als illustrative
Beispiele, keine finalen UI-Icons — konkrete Umsetzung offen).

## 15. Chips

🔴 **Offene Designentscheidung.** Keine Chip-Komponente ist dokumentiert.

🟡 **Abgeleiteter Bedarf:** `docs/Architecture.md` Kapitel 10 führt „aktive Filter" als Teil des
Zustand-Client-State; daraus ergibt sich plausibler Bedarf an Filter-Chips (z. B. Location-Kategorie,
Musik-Genre, Zeitraum). Ob Chips oder eine andere Filter-UI (z. B. Dropdown/Sheet) verwendet werden, ist
nicht entschieden.

## 16. Navigation

✅ Entschieden (`docs/PRD.md` Kapitel 11, `docs/Architecture.md` Kapitel 7):

- Tab-/Stack-Navigation: **Home → Map → Events → Artists → Favorites → Profile**.
- Login-Gate vor der Hauptnavigation (kein Zugriff ohne Login).
- Aktive Navigation nutzt die Markenfarbe (Kapitel 2/3).
- „Moderne, reduzierte Navigation" als Prinzip (Kapitel 1).

🔴 **Offene Designentscheidung:** Tab-Bar-Gestaltung (Icons + Label vs. nur Icons), Blur-Hintergrund der
Tab-Bar (siehe Kapitel 9), Verhalten von Header/Navigation-Bar pro Screen, konkrete
Stack-Verschachtelung (bereits in `docs/Architecture.md` Kapitel 7 als offen vermerkt — hier nicht
erneut entschieden).

## 17. Bottom Sheets

🔴 **Offene Designentscheidung.** `docs/Architecture.md` Kapitel 7 hat bereits offen gelassen, ob
Location-Details als Modal/Bottom-Sheet oder als eigener Stack-Screen geöffnet werden — diese
Entscheidung wird hier nicht vorweggenommen. Sobald sie getroffen ist, folgen daraus erst
Bottom-Sheet-spezifische Designwerte (Höhen-Stufen, Drag-Handle-Stil, Blur-Hintergrund gemäß Kapitel 9).

## 18. Listen

🔴 **Offene Designentscheidung.** Kein Listen-Stil ist dokumentiert (Zeilenhöhe, Trennlinien vs.
Abstand, Swipe-Aktionen).

🟡 **Abgeleiteter Bedarf** aus bereits entschiedenem Screenumfang (`docs/PRD.md` Kapitel 10): Event-
Tagesprogramm, Künstlerliste, Favoritenliste, Benachrichtigungsliste. Ob diese als Card-Grid (Kapitel 12)
oder als klassische Liste dargestellt werden, ist pro Screen offen.

## 19. Statusfarben

✅ Entschieden (`docs/PRD.md` Kapitel 15/17): drei Auslastungsstufen mit fester Bedeutung, unabhängig
von der Markenfarbe:

- 🟢 Wenig los
- 🟡 Gut besucht
- 🔴 Sehr voll

Zusätzlich zeigt die App laut `docs/PRD.md` Kapitel 15 („Community-Report-Aggregation") bei geringer
Datenlage einen Hinweis („Wenig Meldungen" / „Vorläufige Einschätzung") statt einer der drei Statusfarben
— dieser vierte, neutrale Zustand ist fachlich entschieden, aber farblich/visuell noch nicht gestaltet.

🔴 **Offene Designentscheidung:** konkrete Hex-Werte der drei Statusfarben, Gestaltung des
„vorläufig/wenig Daten"-Zustands, zusätzliche, nicht-farbliche Kodierung der Statusfarben für
Farbfehlsichtige (siehe Kapitel 22 „Accessibility" — in `docs/Design.md` Kapitel 9 ebenfalls offen).

## 20. Animationen

✅ Entschieden (Prinzip, `docs/PRD.md` Kapitel 17): „hochwertige Animationen" sind Teil des
Premium-Anspruchs.

🔴 **Offene Designentscheidung:** konkrete Timing-/Easing-Werte, welche Interaktionen animiert werden
(Screen-Übergänge, Card-Press-Feedback, Realtime-Update von Auslastungs-Badges, Favoriten-Toggle),
Reduced-Motion-Unterstützung (Accessibility, siehe Kapitel 22).

## 21. Bilder

✅ Entschieden (`docs/PRD.md` Kapitel 15 „Storage-Buckets"): automatische Komprimierung und
Größenanpassung, moderne Bildformate (WebP/AVIF sobald unterstützt), mehrere Bildgrößen (Thumbnail/
Medium/Original) pro Bild, eindeutige Dateinamen. Getrennte Storage-Buckets je Entitätstyp (`locations`,
`artists`, `events`, `profiles`, `specials`, `system` — siehe `docs/Database.md` Kapitel 7).

🔴 **Offene Designentscheidung:** Ziel-Seitenverhältnisse je Card-Typ (Kapitel 12), Platzhalter-/
Ladezustand bei fehlendem oder noch ladendem Bild, Bildbehandlung (z. B. Verlaufs-Overlay für
Textlesbarkeit auf Bildern), Umgang mit nutzergenerierten Profilbildern (Zuschnitt/Form).

## 22. Accessibility

✅ Entschieden (Prinzip, `docs/PRD.md` Kapitel 17, `docs/Architecture.md` Kapitel 22): hohe Kontraste
und klare Lesbarkeit gelten ausdrücklich auch im Dark-Mode/Neon-Look; jede Komponente soll
Screenreader-Unterstützung berücksichtigen.

🔴 **Offene Designentscheidung:** konkretes Kontrastziel (z. B. WCAG AA/AAA), Mindestgröße für
Touch-Ziele in px/pt, Unterstützung für dynamische Schriftgrößen (iOS Dynamic Type/Android Font Scale),
Screenreader-Label-Konventionen je Komponente, nicht-farbliche Kodierung der Statusfarben (Kapitel 19),
Reduced-Motion-Verhalten (Kapitel 20).

## 23. Responsive Verhalten

✅ Entschieden (Prinzip, `PROJECT.md` → Design-Richtlinien): Mobile-first, große Touch-Ziele.

🔴 **Offene Designentscheidung:** konkrete Breakpoints (falls unterschiedliche Smartphone-Größen
unterschiedlich behandelt werden), ob/wie Tablet-Bildschirme unterstützt werden (in keinem Dokument
explizit ein- oder ausgeschlossen), Verhalten bei Landscape-Orientierung, Verhalten des Grid-Systems
(Kapitel 6) bei unterschiedlichen Breiten.

## 24. Komponentenregeln

✅ Entschieden, direkt aus `CLAUDE.md` → Komponenten-Regeln und `docs/Architecture.md` Kapitel 22
übernommen:

- Eine Komponente = eine klar abgegrenzte Verantwortung. Keine „God-Components".
- Screens orchestrieren, wiederverwendbare UI-Bausteine liegen im gemeinsamen `components/`-Ordner
  (`docs/Architecture.md` Kapitel 5).
- **Wiederverwendbarkeit vor Screen-spezifischer Einzellösung:** wiederkehrende UI-Bausteine
  (Location-Card, Auslastungs-Badge, Artist-Card, Event-Card, Favoriten-Button) werden als generische,
  parametrisierte Komponenten gebaut, nicht pro Screen dupliziert.
- Props explizit typisieren, keine impliziten `any`-Props.
- Keine Geschäftslogik/Datenzugriff direkt in rein visuellen Komponenten — über Hooks/Props einreichen.
- Styling einheitlich nach diesem Design System — keine Screen-eigenen Ad-hoc-Styles, die davon
  abweichen.
- Namenskonventionen für Komponenten: PascalCase-Dateien/-Namen, Props-Typen ohne `I`-Präfix
  (`docs/Architecture.md` Kapitel 21).
- Jede Komponente berücksichtigt Barrierefreiheit (Kapitel 22 oben) von Beginn an, nicht nachträglich.

## 25. Zusammenfassung

Das PlayaLive Design System steht auf drei bereits verbindlich entschiedenen Säulen: **ausschließlich
Dark Mode**, **eine dominante Markenfarbe** (getrennt von den drei Auslastungs-Statusfarben 🟢/🟡/🔴)
und **große, wiederverwendbare Cards** als zentrales Content-Element. Komponentenregeln (Verantwortung,
Wiederverwendbarkeit, keine Business-Logik in visuellen Komponenten) sind vollständig aus `CLAUDE.md`
und `docs/Architecture.md` übernommen und gelten unverändert für jede hier beschriebene Komponente.

Da in diesem Repository keine visuellen Design-Referenzen (Figma, Bilddateien) vorliegen, bleiben nahezu
alle **konkreten** Werte — Farben, Typografie, Spacing, Radien, Schatten, Icon-Stil, Animationszeiten —
offen. Das Dokument markiert das durchgängig als 🔴, statt Werte anzunehmen.

### Gesammelte offene Designentscheidungen (🔴)

| # | Thema | Kapitel |
|---|---|---|
| 1 | Logo/Wortmarke, App-Icon, Microcopy-Tonalität, konkreter Hex-Wert der Markenfarbe | 2 |
| 2 | Alle konkreten Farbwerte (Hex/RGB) für Hintergrund-, Marken-, Status-, Text- und Akzent-Tokens; Elevation-Stufen | 3 |
| 3 | Schriftfamilie, Type-Scale, Schriftschnitte, Zeilenhöhen | 4 |
| 4 | Spacing-Basiseinheit und -Skala | 5 |
| 5 | Grid-/Spalten-System für Card-Übersichten | 6 |
| 6 | Border-Radius-Werte je Komponententyp | 7 |
| 7 | Schatten-/Elevation-System | 8 |
| 8 | Konkrete Blur-/Transparenzwerte und Einsatzorte für Glassmorphism | 9 |
| 9 | Icon-Bibliothek/-Stil, Icon-Größenraster | 10 |
| 10 | Button-Varianten, -Zustände, -Maße | 11 |
| 11 | Card-Maße, Bildausschnitte, Innenabstände, Placeholder-Verhalten | 12 |
| 12 | Input-Stil (Rahmen/gefüllt, Label, Fehler-/Fokus-Zustand) | 13 |
| 13 | Badge-Gestaltung (Form, Farbe je Kontext), Vertrauenslevel-Darstellung | 14 |
| 14 | Chip-Komponente: Gestaltung und ob überhaupt verwendet | 15 |
| 15 | Tab-Bar-Gestaltung, Header-Verhalten pro Screen | 16 |
| 16 | Bottom-Sheet-Gestaltung (hängt an offener Architekturentscheidung „Modal vs. Stack-Screen") | 17 |
| 17 | Listen-Stil (Zeilenhöhe, Trennlinien, Swipe-Aktionen) | 18 |
| 18 | Hex-Werte der drei Statusfarben, Gestaltung des „vorläufig/wenig Daten"-Zustands, farbunabhängige Statuskodierung | 19 |
| 19 | Animations-Timing/-Easing, Reduced-Motion-Unterstützung | 20 |
| 20 | Bild-Seitenverhältnisse, Placeholder-/Ladezustände, Bildbehandlung | 21 |
| 21 | Kontrastziel (z. B. WCAG-Stufe), Touch-Ziel-Mindestgröße, Dynamic-Type-Unterstützung, Screenreader-Label-Konventionen | 22 |
| 22 | Breakpoints, Tablet-/Landscape-Unterstützung | 23 |

Diese Punkte sollten geklärt werden, sobald die in `docs/PRD.md` Kapitel 17 erwähnten UI-Design-
Entwürfe als Datei vorliegen und geteilt werden können — andernfalls einzeln mit dem Product Owner, wie
bereits beim PRD und bei `docs/Architecture.md` praktiziert.
