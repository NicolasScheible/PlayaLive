# DesignSystem — PlayaLive

> Status: Aktualisiert auf Basis der vom Product Owner bereitgestellten **finalen UI-Designs** (PDF,
> 18 Screens: Splash, Onboarding, Login, Home Dashboard, Live-Karte, Location Detail, Eventliste, Event
> Detail, Kalender, Künstlerübersicht, Künstlerprofil, Favoriten, Community, Happy Hours, Services,
> Wetter, Profil, Einstellungen). Diese Mockups sind gemäß `docs/ui-designs/README.md` die **verbindliche
> Quelle** für alle Designwerte und haben bei Widersprüchen zu Textdokumenten Vorrang, sofern keine
> bewusste Produktentscheidung dagegen dokumentiert ist.
>
> Konkrete Farbwerte in diesem Dokument wurden durch **Pixel-Sampling** der gerenderten Mockup-Seiten
> ermittelt (nicht nach Augenmaß geschätzt) und sind als Näherungswerte aus mehreren, unabhängig
> geprüften Screens gekennzeichnet. Werte, die aus den Mockups nicht eindeutig oder nicht mit
> hinreichender Sicherheit hervorgehen (z. B. exakte Schriftart, exakte px-Maße, Animationstiming),
> bleiben weiterhin als 🔴 offene Designentscheidung markiert — hier wurden keine Annahmen getroffen.
>
> **Wichtiger Hinweis (Scope):** Die Mockups enthielten mehrere Screens/Elemente, die vom bisher in
> `docs/PRD.md` entschiedenen Funktionsumfang von Version 1.0 abwichen. Diese werden in einer
> strukturierten Design-Review Punkt für Punkt mit dem Product Owner geklärt. Bereits entschieden:
> die Navigation (5 Bottom-Tabs + Community-Report-Schnellzugriff + Hamburger-Menü, siehe Kapitel 16)
> sowie die Bestätigung, dass Community-/Social-Feed, Gamification/Rewards, Ticketing/Payment und
> VIP-/Tisch-/Getränke-/Transport-Services **Design- bzw. Zukunftskonzepte** sind und nicht Teil von
> Version 1.0 werden (`docs/PRD.md` Kapitel 11 „Nicht Bestandteil von Version 1.0"). Noch offene
> Review-Punkte (u. a. Reviews-/Bewertungsstruktur) werden gesondert nachgezogen, sobald entschieden.
>
> **Legende:**
> - ✅ **Entschieden** — eindeutig aus den UI-Designs erkennbar (ggf. per Pixel-Sampling verifiziert)
>   oder direkt aus `docs/PRD.md`, `docs/Design.md`, `docs/Architecture.md`, `CLAUDE.md` übernommen.
> - 🟡 **Abgeleiteter Vorschlag (zur Bestätigung)** — folgt aus den Mockups oder bereits entschiedenen
>   Prinzipien, ist aber nicht in jedem Einzelfall zweifelsfrei/durchgängig bestätigt (z. B. weil nur auf
>   einzelnen Screens sichtbar).
> - 🔴 **Offene Designentscheidung** — in den Mockups nicht zweifelsfrei erkennbar und in keinem
>   Dokument festgelegt.
>
> Eine gesammelte Liste aller verbleibenden 🔴-Punkte steht in Kapitel 25 „Zusammenfassung".

## 1. Designphilosophie

✅ Entschieden (`docs/PRD.md` Kapitel 17, `docs/Design.md` Kapitel 1, `PROJECT.md` → Design-Richtlinien;
durch die Mockups durchgängig bestätigt):

- Modernes iOS-Design mit **Premium-Nightlife-Look** — die Mockups zeigen konsequent nächtliche
  Party-/Neon-Ästhetik (Palmen-Silhouetten, Bühnenlicht, Menschenmengen) statt generischer App-Grafik.
- **Nur Dark Mode** — alle 18 Screens sind ausnahmslos dunkel gehalten.
- Große, klare Karten (Cards) für Locations, Events, Künstler statt kompakter Listenzeilen — in den
  Mockups auf fast jedem Screen sichtbar (Home, Karte, Events, Künstler, Favoriten, Happy Hours).
- Moderne, reduzierte Navigation: schlanke Bottom-Bar, klare Icon-Sprache.
- Dezente Glas-/Blur-Effekte, hochwertige Animationen (Timing nicht aus Standbildern ableitbar, siehe
  Kapitel 20), einheitliche Abstände, konsistente Komponenten.
- Mobile-first, große Touch-Ziele, viel visuelle Information (Karte, Icons, Badges für Auslastung).
- Barrierefreiheit: Statusfarben werden in den Mockups nie ausschließlich über Farbe vermittelt, sondern
  immer mit Text kombiniert (z. B. „● Sehr voll", nicht nur ein roter Punkt) — siehe Kapitel 19/22.
- Performance: Karte und Live-Daten müssen auch bei schlechter mobiler Verbindung nutzbar bleiben
  (aus Standbildern nicht überprüfbar, weiterhin als Anforderung übernommen).

## 2. Markenidentität

✅ Entschieden: PlayaLive positioniert sich als **die zentrale, hochwertige Live-Plattform für das
Nightlife an der Playa de Palma** (`docs/PRD.md` Kapitel 1). Aus den Mockups eindeutig erkennbar:

- **Wortmarke „PlayaLive"**: zweifarbiges Logo in einer geschwungenen Script-/Handschrift-Schrift —
  „Playa" in Weiß, „Live" in der Markenfarbe (Neon-Pink/Magenta, siehe Kapitel 3). Der Schriftzug ist auf
  allen Screens identisch positioniert (Splash, Header von Home/Karte/Events/Künstler/Wetter/Community).
- **Claim/Tagline**: „Deine Playa. Live dabei." — erscheint auf Splash Screen und Login.
- **Bildmarke**: eine stilisierte Palme in Neon-Pink-Outline neben dem Schriftzug.
- Die Markenfarbe (Kapitel 3) wird konsistent für Branding, primäre CTAs, aktive Navigation und
  Hervorhebungen eingesetzt — bestätigt PRD Kapitel 17.
- **Statusfarben bleiben ein eigenständiges System**, unabhängig von der Markenfarbe (🟢/🟡/🔴, siehe
  Kapitel 19).

🔴 **Offene Designentscheidung:** exakte Schriftart der Wortmarke (Schriftname nicht aus dem Bild
identifizierbar), App-Icon-Gestaltung (in den Mockups nicht enthalten), Tonalität/Duzen-vs-Siezen der
Microcopy (Mockups duzen durchgängig — „Deine Playa", „Finde deinen Weg" — das ist damit ✅ bestätigt,
aber ein vollständiger Textleitfaden liegt nicht vor).

## 3. Farbpalette

✅ **Per Pixel-Sampling aus den Mockups ermittelt** (Näherungswerte, konsistent über mehrere,
unabhängige Screens geprüft — Splash, Login, Home, Karte, Location Detail):

| Rolle | Näherungswert | Beobachtete Bandbreite | Quelle (Screens) |
|---|---|---|---|
| Basis-Hintergrund (Dark Mode) | **≈ #070B1A** (sehr dunkles Blau-Schwarz, **nicht** reines Schwarz) | #020512 – #0C1222 | durchgängig alle Screens |
| Markenfarbe (Neon-Pink/Magenta) | **≈ #F2247A** | #EB1A6E – #F62779 | Logo, Buttons, aktive Navigation, Filter-Chips, Fortschrittsbalken (Splash, Login, Home, Karte, Location Detail) |
| Status „Sehr voll" (Rot) | **≈ #E31F27** | #DA000A – #E31F27 | Kartenpins, Auslastungs-Badges (Karte, Location Detail) |
| Status „Gut besucht" (Gelb/Gold) | **≈ #F0B80E** | #E5B20E – #FDB500 | Auslastungs-Badges (Home, Karte) |
| Status „Wenig los" (Grün) | **≈ #1B7A2E** | #01792C – #3EAC4A | Kartenpins, Auslastungs-Badges (Karte, Home) |

Weitere, unterstützende Akzentfarben sind in den Mockups sichtbar (z. B. Blau/Lila für einzelne
Kategorie-Icons auf dem Splash Screen, verschiedene Bühnen-/Eventfarben), aber **nicht durchgängig
konsistent genug**, um sie als feste zusätzliche Design-Tokens zu übernehmen — hier weiterhin 🟡/🔴
(siehe unten).

🟡 **Beobachtung, nicht abschließend verifiziert:** Der Gelb/Gold-Ton des „Gut besucht"-Status wirkt
visuell identisch mit dem Akzent der „Happy Hours"-Sektion auf dem Home Dashboard — ob beide bewusst
denselben Design-Token teilen, ist aus dem Standbild nicht zweifelsfrei feststellbar.

🟡 **Vorgeschlagene Token-Struktur** (unverändert aus vorheriger Fassung, jetzt mit Werten hinterlegbar):

| Token-Kategorie | Zweck | Wert |
|---|---|---|
| `color.background.base` | Basis-Hintergrund | ≈ `#070B1A` |
| `color.brand.primary` | Markenfarbe (Buttons, CTAs, aktive Navigation, Branding) | ≈ `#F2247A` |
| `color.status.low` | Auslastung „Wenig los" | ≈ `#1B7A2E` |
| `color.status.medium` | Auslastung „Gut besucht" | ≈ `#F0B80E` |
| `color.status.high` | Auslastung „Sehr voll" | ≈ `#E31F27` |
| `color.text.primary` | Primärer Text auf Dark-Background | `#FFFFFF` (Fließtext/Headlines durchgängig weiß) |
| `color.text.secondary` | Sekundärer/Meta-Text | gedämpftes Weiß/Grau (exakter Wert nicht sicher bestimmbar) |
| `color.border` / `.divider` | Card-Ränder, oft in Marken- oder Statusfarbe statt neutralem Grau | — |

🔴 **Offene Designentscheidung:** exakter Hex-Wert für sekundäre/gedämpfte Textfarbe, Anzahl und Werte
etwaiger zusätzlicher Hintergrund-/Elevation-Ebenen (Cards heben sich in den Mockups erkennbar primär
über einen **farbigen Rahmen** vom Hintergrund ab, nicht eindeutig über eine separat hellere Füllfarbe —
ein echtes Elevation-System ist aus den Standbildern nicht zweifelsfrei ablesbar), Werte für weitere
unterstützende Akzentfarben (Kategorie-Icons, Wetter-Akzent).

## 4. Typografie

✅ **Muster eindeutig aus den Mockups erkennbar:**

- **Wortmarke „PlayaLive"**: eigene, geschwungene Script-/Handschrift-Schrift, ausschließlich für das
  Logo verwendet — nicht für UI-Text.
- **UI-Text** (Headlines, Body, Labels): durchgängig eine klare, moderne, serifenlose Schrift (Sans-
  Serif) im Stil systemnaher iOS-Schriften.
- Klar erkennbare **Hierarchie-Stufen**:
  1. **Große, fette Zahlen/Headlines** für zentrale Werte (z. B. Temperatur „28°", Auslastung „85%",
     Countdown-Timer) — deutlich größer und fetter als alle anderen Textebenen.
  2. **Section-Labels in Versalien mit Buchstabenabstand**, meist mit vorangestelltem Icon (z. B. „LIVE
     AUSLASTUNG", „SPIELT GERADE", „HIGHLIGHTS HEUTE", „HAPPY HOURS", „COMMUNITY REPORTS").
  3. **Titel/Namen** (Location-, Event-, Künstlername) in mittlerer bis hoher Schriftstärke, deutlich
     größer als Fließtext.
  4. **Body-/Metatext** (Adressen, Uhrzeiten, Beschreibungen) kleiner und in gedämpftem Weiß/Grau.
  5. **Caption/Meta-Kleinstschrift** (z. B. „vor 15 Min", Bewertungsanzahl in Klammern) am kleinsten.

🔴 **Offene Designentscheidung:** exakter Schriftfamilien-Name (aus einem Bild nicht zuverlässig
identifizierbar), konkrete Punkt-/Pixelgrößen je Hierarchiestufe, Schriftschnitte/Gewichtsstufen als
benannte Tokens, Zeilenhöhen, Letter-Spacing-Werte für die Versal-Section-Labels.

## 5. Spacing-System

✅ **Muster erkennbar:** Die Mockups zeigen ein sichtbar konsistentes, großzügiges Abstandsraster —
gleichmäßige Abstände zwischen Sections auf dem Home Dashboard, einheitliche Innenabstände in Cards,
konsistente Abstände in horizontalen Card-Karussells (Live-Auslastung, Highlights, Happy Hours).

🔴 **Offene Designentscheidung:** konkrete Basis-Einheit und Skala (z. B. 4pt- oder 8pt-Raster) — aus
einem PDF-Standbild ohne bekannte Referenzgröße nicht zuverlässig in exakten px/pt-Werten messbar, da
die tatsächliche Zielauflösung/Gerätebreite der Mockups nicht bekannt ist. Empfehlung: bei Zugriff auf
die Originaldatei (z. B. Figma) die dort hinterlegten echten Maße auslesen, statt aus dem PDF zu
schätzen.

## 6. Grid-System

✅ **Muster eindeutig erkennbar:** Kein klassisches Mehrspalten-Grid. Stattdessen zwei konsistente
Layout-Muster:

- **Horizontale Card-Karussells** (scrollbare Reihen) für kuratierte/featured Inhalte: „Live Auslastung",
  „Highlights heute", „Happy Hours" auf dem Home Dashboard; „In deiner Nähe" auf der Karte.
- **Vertikale Einspalten-Listen** für vollständige Übersichten: Eventliste, Künstlerübersicht, Favoriten,
  Happy-Hours-Liste, Services.

🔴 **Offene Designentscheidung:** konkrete Gutter-/Randbreiten, Verhalten bei unterschiedlichen
Gerätebreiten (siehe Kapitel 23).

## 7. Border Radius

✅ **Muster eindeutig erkennbar:** Durchgängig **großzügig abgerundete** Ecken, deutlich runder als ein
iOS-Systemstandard:

- **Buttons, Badges, Filter-Chips, Suchleiste**: vollständig abgerundet („Pill"-/Stadium-Form).
- **Cards und Bilder**: großzügiger, sichtbarer Radius (deutlich abgerundetes Rechteck, keine scharfen
  Ecken), konsistent über Location-, Event-, Künstler- und Happy-Hour-Cards.
- **Bottom Sheet** (Karte, „In deiner Nähe"): abgerundete obere Ecken mit Drag-Handle.

🔴 **Offene Designentscheidung:** exakte Radius-Werte in px/pt je Komponententyp (aus dem PDF ohne
bekannte Referenzgröße nicht zuverlässig messbar, siehe Kapitel 5).

## 8. Schatten

🟡 **Beobachtung:** Auf dem sehr dunklen Hintergrund sind klassische Schlagschatten in den Mockups
kaum erkennbar bzw. nicht von der Dunkelheit zu unterscheiden. Cards grenzen sich erkennbar primär über
einen **farbigen Rahmen** (Marken- oder Statusfarbe) vom Hintergrund ab, nicht über sichtbare
Tiefenschatten.

🔴 **Offene Designentscheidung:** ob zusätzlich ein (dezentes) Schatten-/Elevation-System existiert,
Schattenfarbe/-stärke falls ja.

## 9. Blur- und Glassmorphism-Effekte

✅ Entschieden (Prinzip, `docs/PRD.md` Kapitel 17): „Dezente Glas-/Blur-Effekte" sind Teil der visuellen
Sprache.

🟡 **Beobachtung aus den Mockups:** Die Bottom-Navigation wirkt auf mehreren Screens leicht transluzent/
abgesetzt vom Inhalt dahinter — ein Hinweis auf einen Blur-/Transparenz-Effekt, aus einem Standbild aber
nicht zweifelsfrei von einer einfachen dunklen Fläche zu unterscheiden.

🔴 **Offene Designentscheidung:** ob und wo tatsächlich Blur/Transparenz eingesetzt wird (Tab-Bar,
Bottom Sheets, Header beim Scrollen), konkrete Blur-Radius-/Transparenzwerte.

## 10. Icons

✅ **Eindeutig aus den Mockups erkennbar:**

- **Icon-Stil:** überwiegend **Outline-/Linien-Icons** (nicht flächig gefüllt), reduziert und klar.
- **Farbregel:** Icons erscheinen standardmäßig in Weiß/Grau; im aktiven/hervorgehobenen Zustand
  (z. B. aktiver Tab, ausgewählter Filter) in der Markenfarbe.
- **Kategorie-Icons mit farbigem Kreis-Badge**: auf dem Splash Screen tragen die fünf Kategorie-Icons
  (Musik, Kalender, Community/Personen, Cocktail, Herz) jeweils einen eigenfarbigen Kreishintergrund
  (Pink, Gold/Orange, Grün, Blau/Violett, Rot/Pink) — ein bewusstes Akzentfarben-pro-Kategorie-Muster.

🟡 **Abgeleiteter Bedarf** (Icon-Inventar aus sichtbaren Screens, keine neue Funktion): Navigation (Home/
Karte/Events/Profil, plus Menü-Icon „☰"), Suche, Filter/Sortierung, Auslastungsstatus (Punkt-Icon),
Favoriten (Herz aktiv/inaktiv), Wetter (Sonne/Mond/Wolke etc.), Benachrichtigungsglocke, Standort/Route,
Teilen, Telefon, Website, Instagram/Spotify/YouTube/TikTok, Login-Provider (Apple/Google/E-Mail),
Kategorie-Filter (Clubs & Bars, Restaurants, Services, Toiletten), Verifizierungs-Häkchen.

🔴 **Offene Designentscheidung:** exakte Icon-Bibliothek/-Quelle, Icon-Größenraster in px/pt.

## 11. Buttons

✅ **Eindeutig aus den Mockups erkennbar**, mindestens drei Varianten:

1. **Primary (gefüllt):** vollflächig in der Markenfarbe, weißer/heller fetter Text, Pill-Form. Beispiele:
   „Weiter" (Onboarding), „Los geht's!", „Route anzeigen".
2. **Secondary (Outline):** transparenter/dunkler Fond mit Rahmen und Text in der Markenfarbe, Pill-Form.
   Beispiele: „Erinnerung setzen", „Mit E-Mail anmelden".
3. **Social-Login-Buttons:** neutral/hell gefüllte Pills mit Provider-Icon + dunklem Text (Apple, Google)
   — bewusst **nicht** in der Markenfarbe, sondern an die jeweilige Plattform-Konvention angelehnt.
4. **Icon-Buttons (rund):** kreisförmig, dunkler halbtransparenter Fond, weißes Icon — z. B. Zurück-Pfeil,
   Teilen, Favoriten-Herz in den Headern von Location-/Event-/Künstlerprofil-Detailscreens.

🔴 **Offene Designentscheidung:** exakte Maße (Höhe, Innenabstand, Radius in px/pt), Zustände
(pressed/disabled/loading), Destruktiv-Variante (z. B. „Abmelden" — in den Mockups als Outline-Button in
Rot/Rahmenfarbe zu sehen, aber nicht eindeutig als eigene systematische Variante bestätigt).

## 12. Cards

✅ **Eindeutig aus den Mockups erkennbar:**

- Große, bildbasierte Karten mit **dunklem Verlaufs-Overlay am unteren Bildrand**, damit darüberliegender
  weißer Text lesbar bleibt (durchgängiges Muster auf Location-, Event- und Happy-Hour-Cards).
- Card-Rahmen häufig in Marken- oder Statusfarbe (siehe Kapitel 8).
- Auslastungs-Badge (Punkt + Text) und ggf. Distanz-/Wartezeit-Angabe direkt auf oder unter dem Bild.
- Favoriten-Herz als kleines, rundes Overlay-Icon typischerweise oben rechts auf der Card.

🟡 **Bestätigter Inhaltsbedarf** je Card-Typ (aus Mockups + Datenmodell, keine neue Funktion):

| Card | Sichtbarer Inhalt in den Mockups |
|---|---|
| `LocationCard` | Bild (mit Verlaufs-Overlay), Name, Auslastungs-Badge (Punkt + Text), Wartezeit, Favoriten-Herz, teils Distanzangabe |
| `EventCard` | Uhrzeit, Künstlerbild (rund), Name, „Live on Stage"-Label, Location, Auslastungs-Badge, Distanz, Favoriten-Herz |
| `ArtistCard` | Bild, Name, Verifizierungs-Häkchen, Genre, Bewertung (Sterne + Anzahl), Event-/Location-Anzahl, Social-Icons |
| `HappyHourCard` | Location-Bild/-Logo, Name, Zeitraum, Angebot (z. B. „2 für 1"), Wochentags-Auswahl, Favoriten-Herz |

🔴 **Offene Designentscheidung:** exakte Card-Maße/Seitenverhältnisse in px/pt, Innenabstände,
Platzhalter-Darstellung bei fehlendem Bild.

## 13. Inputs

✅ **Eindeutig aus den Mockups erkennbar:** Ein durchgängiger Such-/Eingabefeld-Stil: **Pill-Form**,
dunkel gefüllt, Lupe-Icon links, gedämpfter Platzhaltertext, teils Filter-/Sortier-Icon rechts
(sichtbar auf Home, Künstlerübersicht, Community).

🟡 **Bedarf aus sichtbaren Screens:** E-Mail-/Passwort-Felder (Login, in den Mockups nicht einzeln
aufgeklappt sichtbar, nur als Button-Einstieg „Mit E-Mail anmelden"), Freitext-Eingabe im Community-Feed
(„Was geht ab, Lisa?").

🔴 **Offene Designentscheidung:** konkreter Feld-Stil für tatsächliche Texteingabe (Login-Formular,
Community-Post), Fehlerzustand-/Fokus-Darstellung — in den Mockups nicht in einem ausgefüllten/
fehlerhaften Zustand gezeigt.

## 14. Badges

✅ **Eindeutig aus den Mockups erkennbar**, mehrere Badge-Typen:

- **Auslastungs-Badge:** farbiger Punkt + Text (z. B. „● Sehr voll"), Pill-Hintergrund optional.
- **„LIVE"-Badge:** kompakte, solide gefüllte Pill in Rot/Pink mit weißem Text, meist neben einem
  Live-Waveform-Symbol (siehe Kapitel 20).
- **„TOP DEAL"-Badge:** solide gefüllte Pink-Pille/Ribbon in der Bildecke einer Card (Happy Hours).
- **Verifizierungs-Häkchen:** kleines rundes Häkchen-Icon direkt neben Location-/Künstlernamen.
- **Benachrichtigungs-Zähler:** kleiner roter/pinker Kreis mit Zahl auf Icons (Glocke, Warenkorb).

🔴 **Offene Designentscheidung:** exakte Maße/Formen je Badge-Typ, Darstellung des Vertrauenslevels
(`docs/PRD.md` nennt beispielhafte Symbole 🌱/⭐/🌟/👑, in den vorliegenden Mockups nicht als eigener
Screen-Bestandteil sichtbar).

## 15. Chips

✅ **Eindeutig aus den Mockups erkennbar und sehr konsistent verwendet:** Horizontale, scrollbare
Filter-Chip-Reihen erscheinen auf praktisch jedem Übersichts-Screen — Karte („Alle Locations", „Clubs &
Bars", „Restaurants" …), Eventliste („Alle Events", „Künstler", „Locations", „Genre"), Künstlerübersicht
(„Alle", „Live Acts", „DJs", "Bands", „MCs"), Happy Hours („Alle Angebote", „Getränke", „Cocktails" …),
Services. Aktiver Chip: voll in Markenfarbe gefüllt, weißer Text. Inaktiver Chip: dunkler Fond mit
Rahmen/Outline.

🔴 **Offene Designentscheidung:** exakte Maße, Abstand zwischen Chips.

## 16. Navigation

✅ **Entschieden** (Design-Review mit dem Product Owner, `docs/PRD.md` Kapitel 11):

- **Bottom-Navigation mit 5 Elementen**: Home, Karte, ein zentraler, erhöhter, kreisrunder Button in
  Markenfarbe, Events, Profil.
- Der zentrale Button ist **kein Floating-Action-Button und kein Navigationsziel**, sondern
  ausschließlich ein **Schnellzugriff auf den Community-Report-Flow** (Auslastung, Wartezeit, Stimmung,
  Musikrichtung, optional Kommentar).
- Aktives Tab-Icon + Label in der Markenfarbe, inaktive in Weiß/Grau.
- **Hamburger-Menü** (Icon „☰" oben links auf mehreren Screens) für sekundäre Bereiche: Künstler,
  Favoriten, Happy Hours, Wetter, Services, Einstellungen, Hilfe, Datenschutz, Über PlayaLive.
- Header-Varianten: Übersichts-Screens zeigen Logo mittig + Suche/Benachrichtigung/Kalender rechts;
  Detail-Screens (Location, Event, Künstler) zeigen runde Icon-Buttons „Zurück / Teilen / Favorisieren".

🔴 **Offene Designentscheidung:** exakte Tab-Bar-Maße, Blur-/Transparenzstärke (siehe Kapitel 9),
visuelle Gestaltung des Hamburger-Menüs selbst (Slide-in vs. Vollbild, Reihenfolge der Einträge).

## 17. Bottom Sheets

✅ **Eindeutig aus den Mockups erkennbar:** Auf der Live-Karte wird die Liste „In deiner Nähe" als
**Bottom Sheet mit Drag-Handle** über der Karte dargestellt (halbtransparent/abgesetzt, mit sichtbarem
Ziehgriff). Location Detail, Event Detail und Künstlerprofil sind dagegen **eigene Stack-Screens** mit
vollem Header und eigenem Zurück-Button, **keine** Bottom Sheets/Modals.

Das löst den in `docs/Architecture.md` Kapitel 7 vermerkten offenen Punkt „Modal vs. Stack-Screen für
Location-Details" für Location Detail zugunsten von **Stack-Screen** — diese Aktualisierung ist jedoch
nicht Teil dieses Dokuments und wird gesondert zurückgemeldet.

🔴 **Offene Designentscheidung:** konkrete Höhen-Stufen/Snap-Points des Bottom Sheets, exakter
Drag-Handle-Stil.

## 18. Listen

✅ **Eindeutig aus den Mockups erkennbar, zwei Varianten:**

- **Kompakte Listenzeile** (Eventliste „Tagesprogramm"): Uhrzeit, kleines rundes Künstlerbild, Name,
  Status, Location, Distanz — durch dünne Trennlinien/Abstand statt Cards getrennt.
- **Card-Listenzeile** (Künstlerübersicht, Favoriten): größeres Bild, mehr Metadaten (Bewertung, Events,
  Locations, Social-Icons), optisch näher an einer Card als an einer klassischen Liste.

🔴 **Offene Designentscheidung:** exakte Zeilenhöhen, Swipe-Aktionen (in Standbildern nicht erkennbar).

## 19. Statusfarben

✅ **Vollständig bestätigt und mit Werten hinterlegt** (siehe Kapitel 3): drei Auslastungsstufen, in den
Mockups durchgängig als **farbiger Punkt + Textlabel** dargestellt (nie Farbe allein):

- 🟢 „Wenig los" — ≈ `#1B7A2E`
- 🟡 „Gut besucht" — ≈ `#F0B80E`
- 🔴 „Sehr voll" — ≈ `#E31F27`

Zusätzlich zeigt Location Detail einen **radialen Fortschrittsring** mit Prozentwert (z. B. „85 %
Auslastung") in der jeweiligen Statusfarbe — eine weitere, bislang nicht dokumentierte Darstellungsform
der Auslastung neben dem einfachen Badge.

🔴 **Offene Designentscheidung:** Gestaltung des in `docs/PRD.md` beschriebenen vierten Zustands „wenig
Meldungen/vorläufige Einschätzung" (in den Mockups nicht sichtbar), exakte Werte für den Fortschrittsring
(Strichstärke etc.).

## 20. Animationen

✅ Entschieden (Prinzip, `docs/PRD.md` Kapitel 17): „hochwertige Animationen" sind Teil des
Premium-Anspruchs — aus Standbildern nicht direkt überprüfbar.

🟡 **Beobachtung:** Auf Location Detail ist neben dem „LIVE"-Badge eine **Audio-Waveform-Grafik**
abgebildet (vertikale Balken unterschiedlicher Höhe) — ein starkes Indiz für eine animierte/pulsierende
Live-Anzeige, auch wenn die eigentliche Bewegung aus einem Standbild nicht ableitbar ist. Ebenso legt der
Countdown-Timer („Nächster Act", Format Std:Min:Sek) eine zeitbasierte Aktualisierung nahe.

🔴 **Offene Designentscheidung:** konkrete Timing-/Easing-Werte, Reduced-Motion-Unterstützung.

## 21. Bilder

✅ **Eindeutig aus den Mockups erkennbar:**

- **Dunkles Verlaufs-Overlay** am unteren Bildrand von Cards für Textlesbarkeit (siehe Kapitel 12) — ein
  durchgängiges, bestätigtes Muster.
- **Rechteckige, stark abgerundete Bilder** für Locations/Events/Happy Hours.
- **Kreisrunde Bilder** für Künstler-/Profilbilder (Avatare), auch für kleine Künstlerbilder in
  Eventlisten.
- Ergänzend zu den bereits entschiedenen Storage-/Format-Vorgaben (`docs/PRD.md` Kapitel 15:
  Komprimierung, WebP/AVIF, mehrere Größen, getrennte Buckets je Entitätstyp — `docs/Database.md`
  Kapitel 7).

🔴 **Offene Designentscheidung:** exakte Ziel-Seitenverhältnisse in Zahlen, Placeholder-/Ladezustand bei
fehlendem Bild (in den Mockups nicht gezeigt, da alle Beispielbilder befüllt sind).

## 22. Accessibility

✅ **Positiv bestätigtes Muster:** Statusfarben werden in den Mockups **nie ausschließlich über Farbe**
vermittelt, sondern immer zusätzlich mit einem Textlabel kombiniert („● Sehr voll" statt nur eines roten
Punkts) — das deckt einen Teil des zuvor offenen Punkts zur farbunabhängigen Statuskodierung ab. Der
durchgängig hohe Kontrast (heller Text auf sehr dunklem Hintergrund, Verlaufs-Overlays auf Bildern) ist
über alle Screens konsistent.

🔴 **Weiterhin offene Designentscheidung:** konkretes Kontrastziel (z. B. WCAG-Stufe), Mindestgröße für
Touch-Ziele in px/pt, Unterstützung für dynamische Schriftgrößen, Screenreader-Label-Konventionen je
Komponente, Reduced-Motion-Verhalten — all das ist aus statischen Mockups grundsätzlich nicht ableitbar.

## 23. Responsive Verhalten

✅ Entschieden (Prinzip, `PROJECT.md` → Design-Richtlinien): Mobile-first, große Touch-Ziele.

🟡 **Beobachtung:** Alle Mockups zeigen ausschließlich ein einheitliches iPhone-Format (gleiche
Statusleiste, ein Gerätetyp) — es liegt keine Variante für andere Displaygrößen oder Tablets vor.

🔴 **Offene Designentscheidung:** Breakpoints, Tablet-/Landscape-Unterstützung, Verhalten des
Grid-Systems (Kapitel 6) bei unterschiedlichen Breiten.

## 24. Komponentenregeln

✅ Entschieden, direkt aus `CLAUDE.md` → Komponenten-Regeln und `docs/Architecture.md` Kapitel 22
übernommen (unverändert, durch die Mockups nicht widerlegt — im Gegenteil: die durchgängige
Wiederverwendung identischer Card-, Badge-, Chip- und Button-Muster über alle Screens hinweg bestätigt
das Prinzip „Wiederverwendbarkeit vor Screen-spezifischer Einzellösung" empirisch):

- Eine Komponente = eine klar abgegrenzte Verantwortung. Keine „God-Components".
- Screens orchestrieren, wiederverwendbare UI-Bausteine liegen im gemeinsamen `components/`-Ordner
  (`docs/Architecture.md` Kapitel 5).
- **Wiederverwendbarkeit vor Screen-spezifischer Einzellösung:** wiederkehrende UI-Bausteine
  (Location-Card, Auslastungs-Badge, Artist-Card, Event-Card, Favoriten-Button, Filter-Chip) werden als
  generische, parametrisierte Komponenten gebaut, nicht pro Screen dupliziert.
- Props explizit typisieren, keine impliziten `any`-Props.
- Keine Geschäftslogik/Datenzugriff direkt in rein visuellen Komponenten — über Hooks/Props einreichen.
- Styling einheitlich nach diesem Design System — keine Screen-eigenen Ad-hoc-Styles, die davon
  abweichen.
- Namenskonventionen für Komponenten: PascalCase-Dateien/-Namen, Props-Typen ohne `I`-Präfix
  (`docs/Architecture.md` Kapitel 21).
- Jede Komponente berücksichtigt Barrierefreiheit (Kapitel 22 oben) von Beginn an, nicht nachträglich.

## 25. Zusammenfassung

Die vom Product Owner bereitgestellten UI-Designs bestätigen und konkretisieren die bisherigen
Design-Prinzipien deutlich: **Dark Mode** mit einem sehr dunklen Blau-Schwarz (≈ `#070B1A`, nicht
reines Schwarz), einer **Neon-Pink/Magenta-Markenfarbe** (≈ `#F2247A`) und drei klar unterscheidbaren,
immer mit Text kombinierten **Statusfarben** (Grün ≈ `#1B7A2E` / Gelb-Gold ≈ `#F0B80E` / Rot ≈
`#E31F27`). Wiederkehrende Muster — durchgängig abgerundete Pill-/Card-Formen, Verlaufs-Overlays auf
Bildern, horizontale Karussells für kuratierte Inhalte, Outline-Icons, Filter-Chip-Reihen — sind über
alle 18 Screens hinweg konsistent und bestätigen empirisch das bereits entschiedene Prinzip
„Wiederverwendbarkeit vor Screen-spezifischer Einzellösung".

Nicht aus Standbildern ableitbar bleiben insbesondere: exakte px/pt-Maße (Typografie, Spacing, Radien),
Animationstiming, Kontrast-/Accessibility-Kennwerte und die exakte Schriftart. Diese sind weiterhin
unten als 🔴 offen gelistet.

### Gesammelte offene Designentscheidungen (🔴)

| # | Thema | Kapitel |
|---|---|---|
| 1 | Exakte Schriftart der Wortmarke, App-Icon-Gestaltung, vollständiger Microcopy-Leitfaden | 2 |
| 2 | Exakter Wert der sekundären/gedämpften Textfarbe; Elevation-System (falls vorhanden) | 3 |
| 3 | Schriftfamilien-Name, konkrete Punkt-/Pixelgrößen, Zeilenhöhen, Letter-Spacing | 4 |
| 4 | Spacing-Basiseinheit und -Skala in px/pt | 5 |
| 5 | Gutter-/Randbreiten des Layouts | 6 |
| 6 | Exakte Border-Radius-Werte je Komponententyp in px/pt | 7 |
| 7 | Schatten-/Elevation-System (ob überhaupt vorhanden) | 8 |
| 8 | Konkrete Blur-/Transparenzwerte und -orte | 9 |
| 9 | Exakte Icon-Bibliothek/-Quelle, Icon-Größenraster | 10 |
| 10 | Button-Maße, -Zustände (pressed/disabled/loading), Destruktiv-Variante | 11 |
| 11 | Exakte Card-Maße/Seitenverhältnisse, Placeholder-Verhalten bei fehlendem Bild | 12 |
| 12 | Eingabefeld-Stil für Login-Formular/Community-Post, Fehler-/Fokus-Zustand | 13 |
| 13 | Exakte Badge-Maße je Typ, Vertrauenslevel-Darstellung | 14 |
| 14 | Exakte Chip-Maße/-Abstände | 15 |
| 15 | Tab-Bar-Maße, Blur-Stärke, visuelle Gestaltung des Hamburger-Menüs | 16 |
| 16 | Bottom-Sheet-Snap-Points, Drag-Handle-Stil | 17 |
| 17 | Zeilenhöhen und Swipe-Aktionen in Listen | 18 |
| 18 | Gestaltung des „wenig Meldungen"-Zustands, Fortschrittsring-Strichstärke | 19 |
| 19 | Animations-Timing/-Easing, Reduced-Motion-Unterstützung | 20 |
| 20 | Exakte Bild-Seitenverhältnisse, Placeholder-/Ladezustände | 21 |
| 21 | Kontrastziel, Touch-Ziel-Mindestgröße, Dynamic-Type-Unterstützung, Screenreader-Labels | 22 |
| 22 | Breakpoints, Tablet-/Landscape-Unterstützung | 23 |

Diese Punkte lassen sich aus Standbildern grundsätzlich nicht zweifelsfrei bestimmen — sie sollten bei
Zugriff auf die Originaldatei (z. B. Figma mit echten Maßangaben) nachgezogen oder einzeln mit dem
Product Owner geklärt werden, wie bereits bei PRD und Architecture.md praktiziert.
