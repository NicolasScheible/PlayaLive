# PRD — Product Requirements Document — PlayaLive

> Status: Erstfassung, zusammengestellt aus den bestehenden Projektdokumenten. Dieses Dokument ist die
> zentrale Produktreferenz für die weitere Entwicklung von PlayaLive und wird gepflegt, sobald sich eine
> der Quellen ändert.
>
> Quellen: `PROJECT.md`, `README.md`, `CLAUDE.md`, `TASKS.md`, `docs/Lastenheft.md`, `docs/Roadmap.md`,
> `docs/Database.md`, `docs/API.md`, `docs/Design.md`.
>
> Es wurden ausschließlich Inhalte aus diesen Dokumenten übernommen bzw. daraus zusammengeführt. Wo eine
> Information in keiner Quelle vorhanden war, ist das Kapitel entsprechend gekennzeichnet und der Punkt
> zusätzlich in Kapitel 19 „Offene Entscheidungen" aufgeführt — es wurden keine neuen Annahmen getroffen.

## 1. Produktvision

PlayaLive ist die zentrale Live-App für Besucher von Playa de Palma, Mallorca. Die App zeigt in Echtzeit:
Clubs, Bars, Events, Künstler, Partystimmung, Auslastung, Öffnungszeiten, Specials und
Community-Meldungen.

Ziel ist, dass Nutzer jederzeit wissen: **„Was passiert gerade in Playa de Palma und wo lohnt es sich
hinzugehen?"**

Langfristig soll PlayaLive:
- die verlässlichste Live-Datenquelle für das Nightlife an der Playa de Palma sein,
- eine aktive Community aufbauen, die Auslastung und Stimmung in Echtzeit meldet,
- Clubs, Bars und Veranstaltern eine Plattform bieten, um Events, Künstler und Specials sichtbar zu
  machen.

*(Quelle: `PROJECT.md` → Projektbeschreibung, Vision)*

## 2. Problemstellung

Besucher der Playa de Palma haben aktuell keine zentrale, verlässliche Quelle, um live einzuschätzen, was
gerade an Clubs und Bars der Region los ist. Statt sich auf einen Blick zu informieren, müssen sie selbst
herumfragen oder raten, wo aktuell etwas los ist, wie voll eine Location ist oder welche Events/Künstler
heute laufen.

*(Quelle: `PROJECT.md` → Projektbeschreibung: „Statt selbst herumzufragen oder zu raten, sieht der Nutzer
auf einen Blick, wo gerade etwas los ist …"; `README.md` → Ziel der App)*

## 3. Zielgruppe

- Urlauber auf Mallorca
- Partyurlauber
- Junge Erwachsene
- Gruppen (Freundesgruppen, Junggesellenabschiede etc.)
- Eventbesucher
- Besucher von Clubs und Bars

*(Quelle: `PROJECT.md` → Zielgruppe)*

## 4. Personas

In den vorhandenen Dokumenten sind ausgearbeitete Personas (Name, Alter, konkrete Bedürfnisse/Zitate)
nicht definiert — nur die grobe Zielgruppen-Liste aus Kapitel 3.

→ Siehe Kapitel 19 „Offene Entscheidungen": Ausarbeitung konkreter Personas auf Basis der Zielgruppe
steht noch aus.

## 5. Ziele der App

- Nutzer sollen jederzeit wissen, was gerade in Playa de Palma passiert und wo es sich hinzugehen lohnt
  (siehe Kapitel 1)
- Die verlässlichste Live-Datenquelle für das Nightlife an der Playa de Palma werden
- Eine aktive Community aufbauen, die Auslastung und Stimmung in Echtzeit meldet
- Clubs, Bars und Veranstaltern eine Plattform bieten, um Events, Künstler und Specials sichtbar zu machen

*(Quelle: `PROJECT.md` → Vision)*

## 6. Nicht-Ziele

- PlayaLive ist **kein allgemeiner Strand-/Reiseführer** — der Fokus liegt ausschließlich auf
  Nightlife/Events an der Playa de Palma, nicht auf allgemeinen Strand- oder Urlaubsinformationen.

*(Quelle: `docs/Lastenheft.md` → 1.3 Abgrenzungskriterien)*

Weitere Abgrenzungskriterien (1.1 Musskriterien, 1.2 Wunschkriterien) sind im Lastenheft noch nicht
ausgefüllt. Eine vollständige Nicht-Ziele-Liste kann erst nach Fertigstellung von `docs/Lastenheft.md`
abgeleitet werden.

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 7. MVP Umfang

Der MVP umfasst laut `PROJECT.md`:

1. **Live Map** — Karte mit Clubs/Bars an der Playa de Palma, Live-Auslastung (Leer/Mittel/Voll)
2. **Events** — Tagesprogramm, kommende Events, Künstler, Startzeiten
3. **Künstlerprofile** — DJs, Auftritte, Favoriten
4. **Favoriten** — Locations und Künstler speichern, Benachrichtigungen erhalten
5. **Community Reports** — Nutzer melden Auslastung, Echtzeit-Updates
6. **Wetter** — Temperatur, Wetterbedingungen

Ergänzend listet `docs/Roadmap.md` (Meilenstein 3 — MVP-Kernfunktionen) zusätzlich **Auth**
(Registrierung/Login) als Bestandteil des MVP, da Favoriten, Community Reports und Benachrichtigungen
einen eingeloggten Nutzer voraussetzen.

*(Quelle: `PROJECT.md` → MVP; `docs/Roadmap.md` → Meilenstein 3)*

## 8. Features nach Priorität

Eine explizite Priorisierung über den MVP hinaus (z. B. Phase 2/3-Feature-Listen) ist in keinem der
vorhandenen Dokumente definiert — `docs/Roadmap.md` → „Post-MVP / Ausblick" ist als `_TODO_` markiert.

Was sich aus den vorhandenen Dokumenten ableiten lässt, ist die Einteilung in **MVP (Kern)** vs. **alles
danach**:

| Priorität | Umfang | Quelle |
|---|---|---|
| P0 — MVP | Live Map, Events, Künstlerprofile, Favoriten, Community Reports, Wetter, Auth | `PROJECT.md` → MVP, `docs/Roadmap.md` → Meilenstein 3 |
| Post-MVP | nicht spezifiziert | `docs/Roadmap.md` → „Post-MVP / Ausblick" (`_TODO_`) |

Eine feinere Priorisierung **innerhalb** des MVP (z. B. welches der sechs Features zuerst umgesetzt wird)
ist ebenfalls nicht dokumentiert.

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 9. User Journey

Auf Basis der dokumentierten Screens (Kapitel 10) und der Produktvision (Kapitel 1) ergibt sich folgender
grober Nutzungsfluss:

1. **Einstieg (Home Screen):** Nutzer öffnet die App und sieht aktuelle Highlights (Top-Events,
   Top-Locations, Trends) sowie die Wetter-Anzeige.
2. **Orientierung (Map Screen):** Nutzer wechselt zur Live Map, sieht Clubs/Bars in der Nähe mit
   aktueller Auslastung (Leer/Mittel/Voll) und öffnet die Detailansicht einer Location (Öffnungszeiten,
   Specials, Events).
3. **Event-/Künstlersuche:** Alternativ browst der Nutzer über den Events-Screen das Tagesprogramm bzw.
   kommende Events, oder über den Artists-Screen Künstlerprofile und deren Auftritte.
4. **Entscheidung:** Anhand von Live-Auslastung, Events und Künstlern entscheidet der Nutzer, wohin er
   geht.
5. **Speichern (Favorites):** Nutzer speichert Locations oder Künstler als Favoriten, um bei Neuigkeiten
   benachrichtigt zu werden.
6. **Beitragen (Community Report):** Vor Ort meldet der Nutzer die aktuelle Auslastung einer Location,
   was in Echtzeit für andere Nutzer sichtbar wird.
7. **Rückkehr:** Über Push-Benachrichtigungen (z. B. Favoriten-Update, Event startet bald, Special) wird
   der Nutzer erneut in die App zurückgeholt.
8. **Verwaltung (Profile):** Nutzer verwaltet Profildaten, Benachrichtigungseinstellungen und
   Login/Logout.

*(Zusammengeführt aus `TASKS.md` → Home Screen, Map Screen, Events, Artists, Favorites, Community
Reports, Notifications, Profile; `PROJECT.md` → Vision. Diese Journey ist eine Zusammenführung bestehender
Screen-/Feature-Beschreibungen, keine separat validierte Spezifikation.)*

## 10. Screenübersicht

| Screen | Inhalt (laut Dokumentation) | Quelle |
|---|---|---|
| Home | Highlights (Top-Events, Top-Locations, Trends), Einstieg in Map/Events/Artists, Wetter-Anzeige | `TASKS.md` → Home Screen |
| Map | Live Map mit Locations (Clubs/Bars), Live-Auslastungs-Anzeige pro Location, Location-Detailansicht (Öffnungszeiten, Specials, Events) | `TASKS.md` → Map Screen; `docs/Design.md` → 7. Screens & Wireframes |
| Events | Tagesprogramm-Ansicht, kommende Events, Event-Detailansicht (Künstler, Startzeit, Location) | `TASKS.md` → Events |
| Artists | Künstlerprofile (DJs), Auftritte (aktuell/kommend) pro Künstler, favorisierbar | `TASKS.md` → Artists |
| Favorites | Gespeicherte Locations und Künstler, Benachrichtigungen bei Neuigkeiten | `TASKS.md` → Favorites |
| Profile | Profilseite (Nutzerdaten), Einstellungen (u. a. Benachrichtigungen), Login/Logout | `TASKS.md` → Profile |

Zusätzlich nennt `docs/Design.md` (Kapitel 7, Screens & Wireframes) einen **Community-Report-Flow** als
eigenen Ablauf (Teil des Map/Location-Kontexts, kein eigener Tab).

Konkrete Wireframes/visuelle Entwürfe existieren aktuell nicht — `docs/Design.md` ist in weiten Teilen
noch als `_TODO_` markiert.

## 11. Hauptnavigation

Laut `TASKS.md` (Abschnitt Navigation) ist die Grundstruktur eine Tab-/Stack-Navigation mit den Bereichen,
in dieser Reihenfolge:

**Home → Map → Events → Artists → Favorites → Profile**

Zusätzlich wird zwischen **Auth-Flow** (nicht eingeloggt) und **App-Flow** (eingeloggt) unterschieden;
die genaue Abgrenzung, welche Screens ohne Login zugänglich sind, ist nicht dokumentiert.

*(Quelle: `TASKS.md` → Navigation)*

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 12. Rollen (Gast, Nutzer, Admin)

In den vorhandenen Dokumenten ist ausschließlich die Rolle **registrierter Nutzer** („Users") beschrieben
(`docs/Database.md` → 2.1 Users). Eine Unterscheidung zwischen **Gast** (nicht eingeloggter Zugriff),
**Nutzer** und **Admin** (Verwaltung von Locations/Events/Artists-Stammdaten) ist in keinem Dokument
definiert:

- Ob und welche Screens ohne Login (Gast-Zugriff) nutzbar sind, ist nicht spezifiziert (siehe Kapitel 11).
- Wer Locations, Events und Artists-Stammdaten pflegt (Admin-/Redaktionsrolle), ist nicht dokumentiert —
  `docs/Database.md` und `docs/API.md` beschreiben nur die Datenstruktur, keine Verwaltungsrolle.
- Row-Level-Security-Regeln (`docs/Database.md` → 4. RLS) sind als `_TODO_` markiert und würden
  rollenspezifische Rechte erst festlegen.

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 13. Monetarisierung

In keinem der vorhandenen Dokumente (`PROJECT.md`, `README.md`, `docs/Lastenheft.md`, `docs/Roadmap.md`)
ist ein Monetarisierungsmodell beschrieben.

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 14. Datenquellen

| Datenquelle | Beschreibung | Quelle |
|---|---|---|
| Community Reports | Nutzer melden aktuelle Auslastung einer Location; Auslastungslevel einer Location wird aus aktuellen/aggregierten Reports abgeleitet | `PROJECT.md` → Hauptfunktionen 5; `docs/Database.md` → 2.6 Reports |
| Wetter | Temperatur, Wetterbedingungen über eine noch zu wählende Wetter-API | `PROJECT.md` → Hauptfunktionen 6; `TASKS.md` → Wetter |
| Locations/Events/Artists (Stammdaten) | Name, Beschreibung, Öffnungszeiten, Specials, Startzeiten, Künstler-Bios etc. | `docs/Database.md` → 2.2–2.4 |
| Kartendaten | Geokoordinaten, Kartendarstellung | `PROJECT.md` → Technologie-Stack (Mapbox) |

Wer bzw. welcher Prozess die Stammdaten zu Locations, Events und Artists pflegt (manuell/redaktionell,
durch Partner/Betreiber selbst, oder anders), ist nicht dokumentiert. Ebenso ist der konkrete
Wetter-API-Anbieter noch nicht ausgewählt (`TASKS.md` → Wetter: „Wetter-API-Anbindung ausgewählt" offen).

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 15. Technische Architektur (Übersicht)

**Technologie-Stack** *(Quelle: `PROJECT.md` → Technologie-Stack)*:
- Frontend: React Native mit Expo (TypeScript)
- Navigation: React Navigation
- Backend/Datenbank: Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- Karten: Mapbox
- Push Notifications: Firebase Notifications
- State Management: noch nicht festgelegt (`PROJECT.md`: „wird in der Architekturphase festgelegt, kein
  Overengineering")

**Architekturprinzipien** *(Quelle: `CLAUDE.md` → Architekturregeln)*:
- Klare Trennung von UI-Komponenten / Screens / Navigation / Datenzugriff (Supabase-Client, API) /
  State-Management
- Business-Logik in dedizierten Modulen/Hooks, nicht in Screens
- Live-/Realtime-Datenflüsse (Auslastung, Community Reports, Notifications) laufen über dieselbe
  Datenzugriffsschicht wie alle anderen Daten

**Datenmodell** *(Quelle: `docs/Database.md`)*: Tabellen Users, Locations, Artists, Events, Favorites,
Reports, Notifications — fachlich beschrieben, RLS/Indizes/Realtime-Kanäle/Storage-Buckets/Migrationen
noch offen (`_TODO_`).

**API-Struktur** *(Quelle: `docs/API.md`)*: Zugriff voraussichtlich über Supabase-Client
(Postgres-Tabellen + Realtime), ggf. ergänzt um Supabase Edge Functions (z. B. für
Auslastungs-Aggregation). Bereiche: Authentication, Locations, Events, Artists, Favorites, Reports,
Notifications. Realtime-Subscriptions, Fehlerbehandlung sowie Rate Limiting & Sicherheit sind als
`_TODO_` markiert.

## 16. Erfolgskennzahlen (KPIs)

In keinem der vorhandenen Dokumente sind Erfolgskennzahlen/KPIs definiert.

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 17. Roadmap

*(Quelle: `docs/Roadmap.md`)*

| Meilenstein | Inhalt | Status |
|---|---|---|
| 0 — Projektgrundlage | Dokumentation, Planung, Lastenheft | in Arbeit |
| 1 — Design & Architektur | UI/UX-Konzept, Datenmodell, API-Design | offen |
| 2 — Technisches Fundament | Expo-Setup, Navigation, Grundkomponenten | offen |
| 3 — MVP-Kernfunktionen | Live Map, Events, Künstlerprofile, Favoriten, Community Reports, Wetter, Auth | offen |
| 4 — Backend-Integration | Supabase (Auth, DB, Realtime, Storage), Mapbox | offen |
| 5 — Notifications & Testing | Push-Benachrichtigungen, Teststrategie und -durchführung | offen |
| 6 — Release | Store-Vorbereitung, Build-Pipeline, Veröffentlichung | offen |

Konkrete Zeiträume sind für alle Meilensteine noch nicht festgelegt (`_TODO_` in `docs/Roadmap.md`). Der
detaillierte, aufgabenbezogene Fortschritt wird separat in `TASKS.md` als Checkliste geführt.

## 18. Risiken

Eine dedizierte Risikoanalyse existiert in keinem der vorhandenen Dokumente. Die folgenden Punkte sind
Risiken, die bereits an anderer Stelle in der Dokumentation als offene Herausforderung benannt sind:

- **Missbrauch von Community Reports:** `docs/API.md` (11. Rate Limiting & Sicherheit) benennt explizit
  das Risiko von Report-Spam/Missbrauch bei der Auslastungsmeldung; ein Schutzkonzept ist noch offen.
- **Fehlende Zugriffsregeln:** `docs/Database.md` (4. Row-Level-Security) ist noch nicht definiert —
  ohne RLS ist der Datenzugriff nicht wie vorgesehen abgesichert.
- **Performance bei schlechter Verbindung:** `PROJECT.md` (Design-Richtlinien) nennt explizit die
  Anforderung, dass Karte und Live-Daten auch bei schlechter mobiler Verbindung nutzbar bleiben müssen —
  ein bekanntes Risiko für ortsabhängige Nutzung am Strand/im Nightlife-Umfeld.
- **Ungeklärte Datenpflege:** Wie in Kapitel 14 beschrieben, ist nicht dokumentiert, wer
  Location-/Event-/Artist-Stammdaten pflegt — ohne diesen Prozess bleibt die Datengrundlage der App
  unklar.

Eine vollständige, systematische Risikobewertung darüber hinaus liegt nicht vor.

→ Siehe Kapitel 19 „Offene Entscheidungen".

## 19. Offene Entscheidungen

Zusammengeführte Liste aller Punkte, zu denen in den vorhandenen Dokumenten keine Information vorlag:

1. **Personas:** ausgearbeitete Personas (Name, Alter, Bedürfnisse, Zitate) auf Basis der Zielgruppe
   (Kapitel 3/4) fehlen.
2. **Vollständige Nicht-Ziele:** `docs/Lastenheft.md` → 1.1 Musskriterien, 1.2 Wunschkriterien sind noch
   nicht ausgefüllt; daraus ließen sich weitere Abgrenzungen ableiten.
3. **Priorisierung über den MVP hinaus:** `docs/Roadmap.md` → „Post-MVP / Ausblick" ist offen; auch eine
   Priorisierung innerhalb der sechs MVP-Features fehlt.
4. **Rollenmodell:** Unterscheidung Gast/Nutzer/Admin, insbesondere wer Zugriff ohne Login hat und wer
   Stammdaten (Locations/Events/Artists) verwaltet.
5. **Monetarisierung:** kein Modell dokumentiert.
6. **Pflege der Stammdaten:** Prozess/Verantwortlichkeit für Locations-, Events- und Artists-Daten nicht
   definiert.
7. **Wetter-API-Anbieter:** noch nicht ausgewählt (`TASKS.md` → Wetter).
8. **State-Management-Ansatz:** laut `PROJECT.md` erst in der Architekturphase zu entscheiden.
9. **Auth-Pflicht vs. Gast-Zugriff:** genaue Abgrenzung Auth-Flow/App-Flow (welche Screens ohne Login
   nutzbar sind) nicht dokumentiert (`TASKS.md` → Navigation).
10. **Row-Level-Security-Regeln:** noch nicht definiert (`docs/Database.md` → 4.).
11. **Report-Aggregationslogik:** wie aus mehreren Community Reports ein Auslastungslevel abgeleitet wird,
    ist noch offen (`docs/Database.md` → 2.6 Reports).
12. **Rate Limiting / Missbrauchsschutz für Reports:** Konzept noch offen (`docs/API.md` → 11.).
13. **ER-Diagramm:** grafische Darstellung des Datenmodells steht noch aus (`docs/Database.md` → 3.).
14. **Realtime-Kanäle, Storage-Buckets, Migrationen, Indizes:** Details noch offen (`docs/Database.md` →
    5.–8.).
15. **Realtime-Subscriptions, Fehlerbehandlung (API):** Details noch offen (`docs/API.md` → 9.–10.).
16. **Design-Details:** Farbpalette, Typografie, Iconografie, Spacing/Layout-Raster,
    Komponenten-Bibliothek, Interaktion/Animation, Accessibility, Light-Mode-Entscheidung — alle als
    `_TODO_` markiert (`docs/Design.md`).
17. **Erfolgskennzahlen (KPIs):** keine definiert.
18. **Zeiträume der Roadmap-Meilensteine:** in `docs/Roadmap.md` durchgehend `_TODO_`.
19. **Systematische Risikobewertung:** über die in Kapitel 18 genannten, bereits an anderer Stelle
    dokumentierten Punkte hinaus liegt keine vor.

Diese Punkte sollten vor bzw. während der jeweils betroffenen Entwicklungsphase (siehe Kapitel 17)
geklärt werden, bevor sie in Code umgesetzt werden — gemäß `CLAUDE.md`: „Keine Annahmen ohne Rückfrage."
