# PRD — Product Requirements Document — PlayaLive

> Status: Vollständige Fassung nach Abschluss der Klärungsrunde mit dem Product Owner. Dieses Dokument
> ist die zentrale, verbindliche Produktreferenz für die weitere Entwicklung von PlayaLive.
>
> Alle in diesem Dokument getroffenen Entscheidungen wurden explizit vom Product Owner bestätigt (gemäß
> `CLAUDE.md`: „Keine Annahmen ohne Rückfrage"). Wo eine Entscheidung noch aussteht oder nur auf
> Prinzip-Ebene getroffen wurde (z. B. konkrete Design-Werte), ist das an der jeweiligen Stelle vermerkt.
>
> Die in Kapitel 21 beschriebenen Architektur-Dokumente `docs/Architecture.md` und `docs/DesignSystem.md`
> sind inzwischen erstellt und enthalten die technischen bzw. gestalterischen Detailentscheidungen, die
> über den in diesem PRD dokumentierten Rahmen hinausgehen. Nächster Schritt: die ADR-Dokumente unter
> `docs/ADR/` (siehe Kapitel 21) werden auf Basis der bereits getroffenen Entscheidungen einzeln
> ausgearbeitet, bevor mit der Implementierung begonnen wird.

## 1. Produktvision

PlayaLive ist die zentrale Live-App für Besucher von Playa de Palma, Mallorca. Die App zeigt in Echtzeit:
Clubs, Bars, Events, Künstler, Partystimmung, Auslastung, Öffnungszeiten, Specials, Happy Hours und
Community-Meldungen.

Ziel ist, dass Nutzer jederzeit wissen: **„Was passiert gerade in Playa de Palma und wo lohnt es sich
hinzugehen?"**

Langfristig soll PlayaLive:
- die verlässlichste Live-Datenquelle für das Nightlife an der Playa de Palma sein,
- eine aktive Community aufbauen, die Auslastung und Stimmung in Echtzeit meldet,
- Clubs, Bars und Veranstaltern eine Plattform bieten, um Events, Künstler und Specials sichtbar zu
  machen,
- sich als offizielle digitale Plattform für das Nightlife an der Playa de Palma etablieren — mit
  Business-Tools für Partner (Dashboard, Analytics, Marketing) und personalisierten, ggf. KI-gestützten
  Empfehlungen für Besucher.

*(Quelle: `PROJECT.md` → Vision; Klärung 5 „Monetarisierung" → Langfristige Plattformstrategie)*

## 2. Problemstellung

Besucher der Playa de Palma haben aktuell keine zentrale, verlässliche Quelle, um live einzuschätzen, was
gerade an Clubs und Bars der Region los ist. Statt sich auf einen Blick zu informieren, müssen sie selbst
herumfragen oder raten, wo aktuell etwas los ist, wie voll eine Location ist oder welche Events/Künstler
heute laufen.

*(Quelle: `PROJECT.md` → Projektbeschreibung)*

## 3. Zielgruppe

- Urlauber auf Mallorca
- Partyurlauber
- Junge Erwachsene
- Gruppen (Freundesgruppen, Junggesellenabschiede etc.)
- Eventbesucher
- Besucher von Clubs und Bars

*(Quelle: `PROJECT.md` → Zielgruppe)*

## 4. Personas

Verbindlich festgelegt durch den Product Owner. Diese drei Personas bilden die Grundlage für sämtliche
Produkt-, UX- und Designentscheidungen.

### Persona 1 — Der Partyurlauber (primäre Persona)
- Alter: 20–30 Jahre
- Reist mit Freunden für mehrere Tage an die Playa de Palma.
- Möchte schnell sehen, wo aktuell die beste Stimmung herrscht.
- Sucht Live-Auslastung, Künstler, Events, Happy Hours und Wartezeiten.
- Nutzt Favoriten und Push-Benachrichtigungen.

### Persona 2 — Das Wochenend-Paar bzw. die Freundesgruppe
- Alter: 25–35 Jahre
- Plant den Abend im Voraus.
- Möchte Locations vergleichen, Events entdecken und den Abend optimal organisieren.
- Nutzt Eventkalender, Karte und Specials.

### Persona 3 — Der Mallorca-Kenner
- Alter: 30–45 Jahre
- Besucht die Playa regelmäßig.
- Interessiert sich für neue Events, Künstler und aktuelle Entwicklungen.
- Nutzt Community Reports, Bewertungen und Favoriten aktiv.

## 5. Ziele der App

- Nutzer sollen jederzeit wissen, was gerade in Playa de Palma passiert und wo es sich hinzugehen lohnt
- Die verlässlichste Live-Datenquelle für das Nightlife an der Playa de Palma werden
- Eine aktive Community aufbauen, die Auslastung und Stimmung in Echtzeit meldet
- Clubs, Bars und Veranstaltern eine Plattform bieten, um Events, Künstler und Specials sichtbar zu machen
- Eine starke Nutzerbasis und Vertrauen aufbauen als Grundlage für langfristige Partnerschaften mit
  Locations (siehe Kapitel 13)

## 6. Nicht-Ziele

Verbindlich festgelegt durch den Product Owner, zur klaren Abgrenzung von Version 1.0.

PlayaLive ist **keine allgemeine Reise-, Hotel- oder Mallorca-App**. Version 1.0 beinhaltet ausdrücklich
**nicht**:

- Ticketverkauf innerhalb der App
- Tisch- oder VIP-Reservierungen
- Hotel- oder Flugbuchungen
- Restaurant- oder Freizeitführer außerhalb des Nightlife-Bereichs
- Chat- oder Direktnachrichten zwischen Nutzern
- Eigenes soziales Netzwerk oder Social Feed
- Story- oder Video-Uploads durch Nutzer
- Gruppenfunktion oder Live-Standorte von Freunden
- Offline-Modus
- Apple Watch oder Wear OS App
- KI-Auslastungsprognosen
- Warteschlangen-Vorhersagen
- Automatische Event- oder Künstlererkennung durch KI
- Erweiterung auf andere Regionen Mallorcas
- Premium-Abonnement für Endnutzer
- Partner-Dashboard oder Location-Manager-Zugang (kommt erst in Version 2.0)
- Ticketing- oder Buchungssysteme
- Öffentliche API für Drittsysteme
- Ein Gastmodus (siehe Kapitel 9 — Login ist ab v1.0 verpflichtend)

Diese Funktionen sind teilweise für spätere Versionen vorgesehen (siehe Kapitel 8), gehören aber
ausdrücklich nicht zum Umfang von Version 1.0.

## 7. MVP Umfang (Version 1.0)

Ziel von Version 1.0: ein hochwertiger, stabiler und vollständiger Launch der Kernfunktionen.

- Home Dashboard
- Live-Auslastung
- Live-Karte
- Clubs & Bars
- Künstler
- Events / Eventkalender
- Party Radar
- Happy Hours & Specials
- Favoriten
- Community Reports
- Bewertungen & Kommentare
- Push-Benachrichtigungen
- Wetter
- Benutzerkonto (verpflichtende Registrierung/Login, siehe Kapitel 9)

*(Quelle: `PROJECT.md` → MVP; Klärung 3 „Priorisierung über MVP hinaus" → Version 1.0)*

„Bewertungen & Kommentare" = Sterne-Bewertung (1–5) mit Kommentar zu Location oder Artist; fachliche
Struktur siehe Kapitel 16 „Bewertungen (Reviews)".

## 8. Priorisierung über den MVP hinaus

Verbindlich festgelegt durch den Product Owner. Die Priorisierung orientiert sich am größtmöglichen
Mehrwert für Nutzer und Partner. Neue Funktionen werden erst umgesetzt, wenn die vorherige Version stabil
abgeschlossen ist.

### Version 2.0 — Ausbau der Plattform
- Location Manager Portal
- Partnerprogramm
- Verwaltung von Specials und Events durch Partner
- Premium-Platzierungen
- Erweiterte Statistiken
- KI-Auslastungsprognosen
- Warteschlangen-Prognosen
- QR-Check-ins zur Verbesserung der Datenqualität
- Erweiterte Community-Funktionen
- Optimierung des Vertrauenssystems

### Version 3.0 — Skalierung
- Ausbau auf weitere Regionen Mallorcas
- Erweiterte Business- und Analysefunktionen
- Zusätzliche Monetarisierungsmöglichkeiten
- Weitere Integrationen mit Partnern
- Kontinuierliche Optimierung auf Basis von Nutzerfeedback und Nutzungsdaten

### Grundprinzipien
- Qualität hat Vorrang vor Geschwindigkeit.
- Neue Funktionen werden erst entwickelt, wenn die bestehende Version stabil ist.
- Entscheidungen orientieren sich am tatsächlichen Nutzerfeedback und an den definierten KPIs (Kapitel
  18).
- Der Fokus liegt jederzeit auf dem Kernnutzen von PlayaLive: aktuelle, zuverlässige und hochwertige
  Live-Informationen rund um das Nachtleben an der Playa de Palma.

## 9. User Journey

1. **Login (verpflichtend):** Neue Nutzer registrieren sich beim ersten Start via Apple Sign-In, Google
   Sign-In oder E-Mail/Passwort (siehe Kapitel 12). Ohne Login ist keine Nutzung der App möglich.
2. **Einstieg (Home Screen):** Nutzer sieht Live-Auslastung auf einen Blick, was gerade läuft
   („Spielt gerade"), aktuelle Highlights (Top-Events, Top-Locations, Trends, Party Radar), Happy Hours
   sowie die Wetter-Anzeige.
3. **Orientierung (Map Screen):** Nutzer wechselt zur Live Map, sieht Clubs/Bars in der Nähe mit
   aktueller Auslastung und öffnet die Detailansicht einer Location (Öffnungszeiten, Specials, Happy
   Hours, Events).
4. **Event-/Künstlersuche:** Alternativ browst der Nutzer über den Events-Screen das Tagesprogramm bzw.
   kommende Events, oder über den Artists-Screen Künstlerprofile und deren Auftritte.
5. **Entscheidung:** Anhand von Live-Auslastung, Events und Künstlern entscheidet der Nutzer, wohin er
   geht.
6. **Speichern (Favorites):** Nutzer speichert Locations, Künstler oder Events als Favoriten, um bei
   Neuigkeiten benachrichtigt zu werden.
7. **Beitragen (Community Report):** Vor Ort (Geofencing-Prüfung, siehe Kapitel 15) meldet der Nutzer die
   aktuelle Auslastung einer Location, was in Echtzeit für andere Nutzer sichtbar wird.
8. **Rückkehr:** Über Push-Benachrichtigungen (z. B. Favoriten-Update, Event startet bald, Special/Happy
   Hour) wird der Nutzer erneut in die App zurückgeholt.
9. **Verwaltung (Profile):** Nutzer verwaltet Profildaten, Benachrichtigungseinstellungen und
   Login/Logout.

## 10. Screenübersicht

Verbindlich festgelegt auf Basis der finalen UI-Designs (Design-Review, siehe `docs/DesignSystem.md`
Kapitel 16). Unterschieden wird zwischen Screens in der Bottom Navigation und Screens, die über das
Hamburger-Menü erreichbar sind (siehe Kapitel 11).

| Screen | Zugriff | Inhalt |
|---|---|---|
| Home | Bottom-Tab | Live-Auslastung-Übersicht, „Spielt gerade", Highlights (Top-Events, Top-Locations, Trends), Party Radar, Happy Hours, Einstieg in Map/Events/Artists, Wetter-Anzeige |
| Map | Bottom-Tab | Live Map mit Locations, Live-Auslastungs-Anzeige pro Location, Location-Detailansicht (Öffnungszeiten, Specials, Happy Hours, Events) |
| Events | Bottom-Tab | Tagesprogramm-Ansicht, kommende Events, Event-Detailansicht (Künstler, Startzeit, Location) |
| Profile | Bottom-Tab | Profilseite (Nutzerdaten, Vertrauenslevel), Einstellungen (u. a. Benachrichtigungen), Login/Logout |
| Artists | Menü | Künstlerprofile (DJs), Auftritte (aktuell/kommend) pro Künstler, favorisierbar |
| Favorites | Menü | Gespeicherte Locations, Künstler und Events, Benachrichtigungen bei Neuigkeiten |
| Happy Hours | Menü | Übersicht aktueller Happy Hours/Specials je Location |
| Weather | Menü | Detaillierte Wetteransicht (siehe Kapitel 14) |
| Services | Menü | Zusatzangebote der Locations — Inhalt für Version 1.0 durch die Nicht-Ziele (Kapitel 6) begrenzt, nicht abschließend spezifiziert |
| Settings | Menü | App-/Kontoeinstellungen |
| Help / Privacy / About | Menü | Hilfe & Support, Datenschutz, Über PlayaLive |

Der **Community-Report-Flow** ist kein eigener Screen im obigen Sinn, sondern über den zentralen
Schnellzugriff-Button der Bottom Navigation erreichbar (siehe Kapitel 11).

Konkrete Wireframes/visuelle Entwürfe: siehe die vom Product Owner bereitgestellten UI-Designs,
ausgewertet in `docs/DesignSystem.md`.

## 11. Hauptnavigation

Verbindlich festgelegt auf Basis der finalen UI-Designs (Design-Review Punkt 1).

### Bottom Navigation

Fünf Elemente, in dieser Reihenfolge:

**Home → Map → Community-Report-Schnellzugriff → Events → Profile**

Home, Map, Events und Profile sind vollwertige Bottom-Tabs. Der mittlere, hervorgehobene Button ist
**kein** Navigationsziel und **kein** allgemeiner Floating-Action-Button, sondern ausschließlich ein
Schnellzugriff auf den Community-Report-Flow.

### Community-Report-Schnellzugriff

Über den zentralen Button meldet der Nutzer innerhalb weniger Sekunden Live-Informationen zu einer
Location:

- Auslastung
- Wartezeit
- Stimmung
- Musikrichtung
- optional: Kommentar

Dies unterstützt direkt den Kernnutzen von PlayaLive (Kapitel 1) und soll ohne Umwege über die Bottom
Navigation erreichbar sein.

> Hinweis: „Musikrichtung" und ein optionaler Kommentar sind gegenüber dem bisherigen Datenmodell
> (Kapitel 16, `docs/Database.md` 2.10) zusätzliche Report-Felder — im Datenmodell nachgezogen.

### Hamburger-Menü

Zusätzlich zur Bottom Navigation gibt es ein Menü (Zugriff über ein Menü-Icon in der Kopfzeile) für
sekundäre Bereiche, die nicht dauerhaft sichtbar sein müssen: Künstler, Favoriten, Happy Hours, Wetter,
Services, Einstellungen, Hilfe & Support, Datenschutz, Über PlayaLive. Diese Bereiche bleiben
vollständiger Bestandteil der App, sind aber nicht Teil der Bottom Navigation.

Da Login ab Version 1.0 verpflichtend ist (siehe Kapitel 12), gibt es keinen separaten „App-Flow ohne
Login" — jeder Nutzer durchläuft vor der Hauptnavigation einen Login-/Registrierungs-Flow.

### Nicht Bestandteil von Version 1.0

Die UI-Designs enthalten zusätzliche Screens (Community-/Social-Feed mit Gruppen, Gamification/Rewards,
Ticketing, Zahlungsmethoden, VIP-/Tisch-/Getränke-/Transport-Services). Diese sind laut Product Owner
**Design- bzw. Zukunftskonzepte** und ändern die bereits in Kapitel 6 (Nicht-Ziele) und Kapitel 8
(Priorisierung) getroffenen Entscheidungen für Version 1.0 nicht.

## 12. Rollenmodell & Authentifizierung

### Login-Pflicht

PlayaLive verwendet ab Version 1.0 ein verpflichtendes Authentifizierungsmodell. Es existiert **kein
Gastmodus**. Jeder Nutzer muss sich vor der Nutzung der App anmelden.

Unterstützte Login-Methoden:
- Apple Sign-In (iOS)
- Google Sign-In
- E-Mail & Passwort

Nach erfolgreicher Anmeldung erhält jeder Nutzer automatisch Zugriff auf sämtliche Funktionen der App
entsprechend seiner serverseitig zugewiesenen Rolle.

Begründung: Nahezu alle Kernfunktionen (Favoriten, Push, Community Reports, Bewertungen (inkl. Kommentar),
geräteübergreifende Synchronisation) basieren auf Personalisierung und Nutzerinteraktion. Ein
verpflichtender Login schafft von Beginn an hohe Datenqualität und eine sichere Grundlage für
Missbrauchsschutz (Kapitel 15) und künftige Partner-/Premium-Funktionen.

### Rollen

| Rolle | Verfügbar ab | Berechtigungen (Kurzfassung) |
|---|---|---|
| **User** | v1.0 | Öffentliche Locations/Events/Artists/Wetter lesen; eigene Favoriten, Reports, Bewertungen (inkl. Kommentar) verwalten; eigenes Profil lesen/bearbeiten |
| **Location Manager** | v2.0 | Zusätzlich: ausschließlich die eigene verifizierte Location, deren Events, Specials, Happy Hours und Bilder verwalten |
| **Admin** | v1.0 | Sämtliche Locations, Künstler, Events verwalten; Community moderieren (Reports, Bewertungen (inkl. Kommentar)); Partner verwalten |
| **Super Admin** | v1.0 | Vollständiger Systemzugriff: zusätzlich Benutzer-/Rollenverwaltung, Systemeinstellungen, Sicherheitsverwaltung, Monetarisierung, Partnerfreigaben |

Detaillierte Row-Level-Security-Policies je Rolle: siehe Kapitel 15.

## 13. Monetarisierung

PlayaLive verfolgt eine mehrstufige Monetarisierungsstrategie, die sich am Wachstum der Plattform
orientiert. Oberstes Ziel von Version 1.0 ist der Aufbau einer starken Nutzerbasis und von Vertrauen —
Monetarisierung wird so umgesetzt, dass das Premium-Nutzererlebnis jederzeit erhalten bleibt.

### Phase 1 — Launch (Version 1.x)
Ziele: aktive Community aufbauen, erste Partner-Locations gewinnen, PlayaLive als zentrale Plattform
etablieren.

Monetarisierung:
- Dezente Werbeanzeigen an geeigneten Stellen (keine störenden Vollbildanzeigen)
- Gesponserte Locations, Events, Happy Hours, Specials
- Hervorgehobene Platzierungen im Home Dashboard und Party Radar

Alle bezahlten Inhalte werden transparent als „Gesponsert" gekennzeichnet.

### Phase 2 — Partnerprogramm
Verifizierte Partner-Locations erhalten gegen eine monatliche Gebühr Zugriff auf zusätzliche Funktionen:
eigene Events/Happy Hours/Specials verwalten, Premium-Darstellung, hervorgehobene Platzierung im Party
Radar, erweiterte Statistiken, eigene Bilder/Inhalte, Verifizierung als offizieller Partner. Redaktionelle
Kontrolle verbleibt bei PlayaLive.

### Phase 3 — Premium Business Partner
Für große Partner (z. B. Megapark, Bierkönig, Oberbayern) zusätzliche Business-Funktionen: exklusive
Werbekampagnen, Promotion neuer Events, Push-Benachrichtigungen an interessierte Nutzer, eigene
Landingpages, Branding in der App, erweiterte Besucher-/Reichweitenstatistiken, Werbeplatzierungen auf
der Startseite.

### Phase 4 — Erweiterte Geschäftsmodelle (Version 2.x)
Affiliate-Partnerschaften, Ticketverkauf, VIP-Reservierungen, Tischreservierungen, Getränkepakete,
Merchandise, optionale Premium-Mitgliedschaften für Nutzer, exklusive Event-Pakete. Ausdrücklich **nicht**
Teil des MVP.

### Grundprinzipien
- Das Nutzererlebnis hat immer Vorrang vor maximalem Werbeumsatz.
- Werbung darf den Premium-Charakter der App nicht beeinträchtigen — keine Pop-ups, keine aufdringlichen
  Vollbildanzeigen.
- Bezahlte Inhalte werden transparent gekennzeichnet.
- Langfristig wichtigste Einnahmequelle: Partner-Locations und Business-Partnerschaften. Klassische
  Display-Werbung ist ausschließlich eine ergänzende Einnahmequelle.

## 14. Datenpflege & Datenquellen

### Datenpflege (Stammdaten)

Für Version 1.0 gilt eine hybride Datenstrategie mit redaktioneller Kontrolle:

- Das PlayaLive-Team (Admin-Rolle) erstellt und pflegt sämtliche Stammdaten (Locations, Künstler, Events,
  Öffnungszeiten, Beschreibungen, Bilder, Kategorien, Musikrichtungen) — recherchiert aus offiziellen
  Quellen (Webseiten, Social Media, Veranstaltungskalender, Presseinformationen, direkter Kontakt).
- Automatisierte Datenimporte/API-Anbindungen werden erst eingesetzt, sobald deren Zuverlässigkeit und
  rechtliche Zulässigkeit sichergestellt sind (spätere Teilautomatisierung für wiederkehrende Infos wie
  Eventkalender, Öffnungszeiten, Specials, Happy Hours — mit Validierung/Korrekturmöglichkeit durch
  Admins).
- Ab Version 2.x erhalten verifizierte Partner-Locations einen „Location Manager"-Zugang und dürfen
  ausschließlich ihre eigenen Inhalte (Events, Specials, Happy Hours, Öffnungszeiten, Bilder,
  Beschreibungen) verwalten. Stammdaten wie Standort, Kategorie und Grundidentität der Location bleiben
  unter Kontrolle des PlayaLive-Teams.

Qualitätsprinzipien: alle Stammdaten werden redaktionell geprüft; Community-Meldungen beeinflussen
ausschließlich Live-Daten (Auslastung, Wartezeit, Stimmung), niemals Stammdaten; Partner dürfen
ausschließlich eigene Inhalte bearbeiten; Änderungen werden versioniert und nachvollziehbar gespeichert.

### Wetter-API

Primärer Anbieter für Version 1.0: **OpenWeather API** (bewährte, stabile REST-API, plattformunabhängig,
gute Kostenstruktur für MVP und Wachstum).

Verwendete Daten: Temperatur, gefühlte Temperatur, Wetterzustand, Regenwahrscheinlichkeit,
Windgeschwindigkeit, Luftfeuchtigkeit, UV-Index, Sonnenauf-/-untergang.

Architektur: Wetterdaten werden niemals direkt im Frontend abgefragt, sondern über einen eigenen
**Weather Service** (Frontend → Weather Service → OpenWeather API). Dadurch bleibt der Anbieter
austauschbar (mögliche Alternativen für v2.x: Tomorrow.io, Apple WeatherKit, Open-Meteo, Meteomatics).
Caching reduziert API-Anfragen.

### Weitere Datenquellen

| Datenquelle | Beschreibung |
|---|---|
| Community Reports | Nutzer melden aktuelle Auslastung/Wartezeit/Stimmung einer Location (Aggregationslogik: Kapitel 15) |
| Kartendaten | Geokoordinaten, Kartendarstellung (Mapbox) |

## 15. Technische Architektur

### Technologie-Stack
- Frontend: React Native mit Expo (TypeScript)
- Navigation: React Navigation
- Backend/Datenbank: Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- Karten: Mapbox
- Push Notifications: Firebase Notifications
- Sprache: TypeScript durchgängig

### State-Management-Architektur

Klare Trennung zwischen Serverdaten, globalem Client-State, lokalem UI-State und Echtzeitdaten:

1. **TanStack Query (Server State):** verwaltet ausschließlich vom Backend geladene Daten (Locations,
   Events, Künstler, Wetter, Favoriten, Specials, Details). Übernimmt Datenabruf, Caching, Background
   Refresh, optimistic Updates, Fehlerbehandlung, Synchronisation mit Supabase.
2. **Zustand (Global Client State):** verwaltet ausschließlich globalen Client-/UI-State — Login-Status,
   aktive Filter, Suchbegriffe, Kartenstatus, Theme, Sprache, Einstellungen, Bottom-Navigation-Zustand.
   Keine Backend-Daten werden dauerhaft in Zustand gehalten.
3. **React State:** lokaler Komponentenstatus (Modals, Inputs, Animationen, Ladezustände, Formulare) —
   ausschließlich React Hooks.
4. **Supabase Realtime:** synchronisiert Live-Daten (siehe Realtime-Kanäle unten) und aktualisiert
   automatisch den TanStack-Query-Cache.
5. **Service Layer:** das Frontend kommuniziert niemals direkt mit Supabase. Alle Backendzugriffe laufen
   über Services (`AuthService`, `LocationService`, `EventService`, `ArtistService`, `FavoriteService`,
   `ReportService`, `NotificationService`, `WeatherService`).

Architekturprinzipien: strikte Trennung UI / Business-Logik / Datenzugriff; kein direkter
Datenbankzugriff aus Screens/Komponenten; wiederverwendbare Custom Hooks kapseln die Kommunikation
zwischen UI und Services; Komponenten enthalten ausschließlich Präsentationslogik.

### Authentifizierung & Autorisierung

Siehe Kapitel 12 (Login-Pflicht, Rollenmodell).

### Row-Level-Security (Supabase)

„Security by Default": alle Tabellen haben aktivierte RLS, jeder Zugriff ist standardmäßig verweigert
(„Deny by Default"), jede Berechtigung wird explizit über Policies freigegeben. Das Frontend entscheidet
niemals über Berechtigungen — alle Sicherheitsregeln werden serverseitig durch Supabase erzwungen.

Rollenbasierte Berechtigungen (Kurzfassung, Details siehe Kapitel 12):
- **User:** darf öffentliche Locations/Events/Artists/Wetter lesen; eigene Favoriten, Reports,
  Bewertungen (inkl. Kommentar) verwalten; nur das eigene Profil lesen/bearbeiten. Darf keine Stammdaten
  verändern, keine anderen Nutzer sehen, keine fremden Reports/Bewertungen bearbeiten.
- **Location Manager (v2.x):** zusätzlich ausschließlich die eigene verifizierte Location, deren Events,
  Specials, Happy Hours, Bilder verwalten. Kein Zugriff auf andere Locations oder Systemdaten.
- **Admin:** verwaltet sämtliche Locations, Künstler, Events; moderiert Community (Reports, Bewertungen,
  Kommentare); verwaltet Partner.
- **Super Admin:** vollständiger Systemzugriff inkl. Benutzer-/Rollenverwaltung, Systemeinstellungen,
  Sicherheitsverwaltung, Monetarisierung, Partnerfreigaben.

Zusätzliche Datenbanksicherheit: jede Tabelle besitzt einen Owner bzw. eine eindeutige Berechtigung;
jeder Datensatz ist einem Ersteller zugeordnet; Änderungen werden mit Zeitstempel gespeichert; kritische
Änderungen werden protokolliert (Audit Log); Soft Delete statt endgültigem Löschen, sofern sinnvoll;
Fremdschlüssel sichern alle Beziehungen. API-Endpunkte prüfen zusätzlich Authentifizierung, Rolle,
Berechtigung, Besitz des Datensatzes, Eingabedaten und Rate Limiting für Community-Funktionen.

### Community-Report-Aggregation (Live-Status)

Der angezeigte Live-Status einer Location (Auslastung, Wartezeit, Stimmung, Besuchertrend) basiert
niemals auf einer einzelnen Meldung, sondern auf der Kombination mehrerer Faktoren:

- **Zeitgewichtung:** neuere Meldungen wiegen stärker. Beispielhafte Staffelung: 0–10 Min = 100 %,
  10–20 Min = 75 %, 20–30 Min = 50 %, 30–45 Min = 25 %, älter als 45 Min = wird verworfen.
- **Vertrauensscore (siehe unten):** Meldungen vertrauenswürdiger Nutzer erhalten automatisch höheres
  Gewicht.
- **Mindestanzahl an Meldungen:** eine einzelne Meldung verändert den Status nie vollständig. Bis
  genügend aktuelle Meldungen vorliegen, wird der Status mit einem Hinweis versehen (z. B. „Wenig
  Meldungen" / „Vorläufige Einschätzung").
- **Mehrfachbestätigung:** treffen mehrere unabhängige Nutzer innerhalb kurzer Zeit ähnliche Meldungen,
  steigt automatisch die Vertrauenswürdigkeit des angezeigten Status.

Zusätzlich angezeigt: Zeitpunkt der letzten Aktualisierung, Anzahl der berücksichtigten Meldungen,
Vertrauensindikator. Version 2.x: zusätzliche Nutzung historischer Daten (Wochentag, Uhrzeit, Saison,
Feiertage, Großveranstaltungen) für KI-Auslastungsprognosen — nicht Teil des MVP.

### Missbrauchsschutz bei Community Reports

Mehrstufiges Sicherheits- und Qualitätssystem:

1. **Authentifizierte Nutzer:** keine anonymen Reports möglich.
2. **Rate Limiting:** max. ein Report pro Nutzer und Location innerhalb eines Zeitfensters (Beispiel: alle
   10 Minuten), serverseitig durchgesetzt.
3. **Geofencing:** ein Report kann nur erstellt werden, wenn sich der Nutzer nachweislich in der Nähe der
   Location befindet (Beispiel-Radius: 100–150 Meter GPS).
4. **Vertrauensscore:** siehe unten — beeinflusst das Gewicht eines Reports.
5. **Mehrfachbestätigung:** siehe oben.
6. **Meldefunktion:** Nutzer können verdächtige Reports melden; gehäufte Meldungen senken den
   Vertrauensscore des Verfassers und markieren den Report zur Admin-Prüfung.
7. **Automatische Missbrauchserkennung:** auffälliges Verhalten (ungewöhnlich viele Reports, ständig
   wechselnde Angaben, Reports an weit entfernten Locations) markiert Accounts automatisch zur Prüfung
   oder schränkt sie ein.
8. **Transparenz:** Zeitpunkt der letzten Aktualisierung, Anzahl berücksichtigter Reports und
   Vertrauensindikator werden immer angezeigt.

Grundsatz: Sicherheit vor Geschwindigkeit; keine anonymen Reports; alle Prüfungen erfolgen serverseitig;
kein einzelner Report entscheidet allein über den Live-Status.

### Vertrauenssystem (Trust Score)

Jeder Nutzer besitzt einen dynamischen, ausschließlich serverseitig berechneten Vertrauensscore.

- Steigt z. B. durch: bestätigte Community Reports, regelmäßige aktive Nutzung, langfristig zuverlässige
  Aktivität, hohe Übereinstimmung mit anderen Nutzern, verifizierte Reports.
- Sinkt z. B. durch: Falschmeldungen, Spam, Manipulationsversuche, gemeldeten Missbrauch, wiederholt
  widersprüchliche Reports, Verstöße gegen Community-Richtlinien.

Jede Änderung wird vollständig protokolliert (eigene Historien-Tabelle `trust_score_events`), damit
Entscheidungen jederzeit nachvollziehbar sind. Der numerische Score ist ausschließlich intern; Nutzer
sehen stattdessen ein verständliches, motivierendes Vertrauenslevel (z. B. „Neues Mitglied" /
„Vertrauenswürdig" / „Erfahrenes Mitglied" / „Top-Mitglied"). Änderungen erfolgen ausschließlich über
Backend-Services/Edge Functions, niemals direkt durch das Frontend.

### Realtime-Kanäle (Supabase Realtime)

Realtime wird gezielt eingesetzt, nicht pauschal für alle Tabellen — nur dort, wo Nutzer einen echten
Mehrwert durch sofortige Aktualisierung erhalten:

- **Aktiviert:** Community Reports (Live-Auslastung, Wartezeit, Stimmung, Trend, Vertrauensindikator),
  Notifications, Events (kurzfristige Änderungen), Specials & Happy Hours, Locations (ausschließlich
  Live-Daten wie Öffnungsstatus/Auslastung — nicht Stammdaten wie Name/Beschreibung/Bilder).
- **Nicht permanent per Realtime synchronisiert:** Künstlerprofile, Benutzerprofile, Einstellungen,
  Favoriten, Bewertungen (inkl. Kommentar), Medien, historische Daten — diese laufen über TanStack Query mit
  Caching/gezielten Aktualisierungen.

Realtime-Abonnements werden ausschließlich über einen zentralen **Realtime Service** verwaltet
(Supabase Realtime → Realtime Service → TanStack-Query-Cache → Custom Hooks → Components). Screens/
Komponenten kommunizieren niemals direkt mit Supabase Realtime. Performance-Regeln: nur sichtbare
Screens abonnieren, nicht sichtbare Screens beenden Subscriptions automatisch, Events werden gebündelt.

### Storage-Buckets

Jeder Medientyp erhält einen eigenen Supabase-Storage-Bucket mit eigenen Policies:

| Bucket | Inhalt | Schreibrechte | Leserechte |
|---|---|---|---|
| `locations` | Location-Bilder (Titel, Innen/Außen, Galerie) | Admin, Super Admin, Location Manager (eigene Location) | alle authentifizierten Nutzer |
| `artists` | Künstlerbilder | Admin, Super Admin | alle authentifizierten Nutzer |
| `events` | Eventbanner, Flyer | Admin, Super Admin, Location Manager (eigene Events) | alle authentifizierten Nutzer |
| `profiles` | Profilbilder | Eigentümer des Profils, Admin | alle authentifizierten Nutzer |
| `specials` | Bilder für Specials & Happy Hours | Admin, Super Admin, Location Manager (eigene Location) | alle authentifizierten Nutzer |
| `system` | Interne Systemdateien (Logos, Icons, App-Assets) | Super Admin | öffentlich/authentifiziert je nach Inhalt |

Upload-Regeln: automatische Komprimierung/Größenanpassung, moderne Bildformate (WebP/AVIF), maximale
Dateigröße, Dateityp-Prüfung, eindeutige Dateinamen (UUID), mehrere Bildgrößen (Thumbnail/Medium/
Original). Direkte Uploads ohne Authentifizierung sind nicht möglich.

### Migrationen

Sämtliche Datenbankänderungen erfolgen ausschließlich über versionierte **Supabase-CLI-Migrationen**,
die im Git-Repository unter `supabase/migrations/` versioniert werden. Schemaänderungen werden niemals
direkt über das Supabase-Dashboard vorgenommen — jede Migration ist nachvollziehbar und reproduzierbar.

### Fehlerbehandlung

Zentrale Fehlerbehandlung im Service Layer:

- Alle API-Aufrufe laufen ausschließlich über den Service Layer; Fehler werden zentral in ein
  einheitliches Format überführt. Screens/Komponenten enthalten keine eigene API-Fehlerlogik.
- Technische Fehlermeldungen werden dem Nutzer nie direkt angezeigt — stattdessen verständliche Texte
  (z. B. „Keine Internetverbindung. Bitte versuche es erneut.").
- Temporäre Netzwerkfehler dürfen automatisch erneut versucht werden (Retry); dauerhafte Fehler (fehlende
  Berechtigung, ungültige Daten) werden nicht automatisch wiederholt.
- Jeder Screen kennt vier klar definierte Zustände: Loading, Success, Empty, Error.
- Fehler werden zentral protokolliert (Logging), ohne personenbezogene Daten zu protokollieren.

## 16. Datenmodell (ER-Übersicht)

Normalisierte Datenbankstruktur — jede fachliche Entität besitzt eine eigene Tabelle, keine komplexen
JSON-Felder für strukturierte Inhalte, Beziehungen ausschließlich über Foreign Keys.

### Tabellen

| Tabelle | Zweck | Wichtige Felder (fachlich) |
|---|---|---|
| `profiles` | Nutzerprofil (erweitert Supabase Auth) | id, email, display_name, avatar_url, role, trust_score, trust_level, reports_count, confirmed_reports, rejected_reports |
| `trust_score_events` | Historie aller Vertrauensscore-Änderungen | user_id, previous_score, new_score, points_changed, reason, reference_type, reference_id, created_by |
| `locations` | Clubs/Bars | name, description, category, address, latitude, longitude, opening_hours, images, is_sponsored, owner_user_id (v2.x), created_by |
| `artists` | DJs/Künstler | name, bio, image, genres, social_links |
| `events` | Veranstaltungen | location_id, title, description, start_time, end_time, image, is_sponsored, created_by |
| `event_artists` | Zuordnung Event↔Artist (n:m) | event_id, artist_id |
| `specials` | Zeitlich begrenzte Aktionen einer Location | location_id, title, description, image, category, start_date, end_date, start_time, end_time, recurring, sponsored, priority, is_active |
| `happy_hours` | Wiederkehrende Angebote einer Location | location_id, title, description, weekday, start_time, end_time, offer_text, sponsored, priority, is_active |
| `favorites` | Favoriten (polymorph) | user_id, target_type (location/artist/event), target_id |
| `reports` | Community-Meldungen zur Auslastung | user_id, location_id, occupancy_level, wait_time, mood, music_genre, comment (optional), latitude, longitude, created_at |
| `report_flags` | Meldungen zu verdächtigen Reports | report_id, flagged_by_user_id, reason |
| `reviews` | Bewertung mit Kommentar zu Location oder Artist | user_id, target_type (location/artist), target_id, rating (1–5), comment_text, created_at, updated_at, deleted_at |
| `review_flags` | Meldungen zu missbräuchlichen Reviews | review_id, flagged_by_user_id, reason, created_at |
| `notifications` | Benachrichtigungen | user_id, type, related_type, related_id, title, message, is_read |
| `partners` | Partner-Verwaltung (v2.x) | user_id, location_id, status, verified_at |

### Beziehungen (fachlich)

- `profiles` —< `favorites` >— `locations` / `artists` / `events` (polymorph über `target_type`)
- `profiles` —< `reports` >— `locations`
- `profiles` —< `report_flags` >— `reports`
- `profiles` —< `reviews` >— `locations` / `artists` (polymorph über `target_type`)
- `profiles` —< `review_flags` >— `reviews`
- `profiles` —< `trust_score_events`
- `profiles` —< `notifications`
- `locations` —< `events`
- `locations` —< `specials`
- `locations` —< `happy_hours`
- `locations` —< `reports`
- `events` >—< `artists` (über `event_artists`)
- `profiles` —< `partners` >— `locations` (v2.x)

### Favoriten-Modell

Eine zentrale polymorphe Tabelle `favorites` (`user_id`, `target_type`, `target_id`) statt getrennter
Tabellen je Typ — ermöglicht eine einheitliche API/Service/Komponenten-Struktur (`addFavorite`,
`removeFavorite`, `toggleFavorite`, `getFavorites`). Da polymorphe Beziehungen keine klassischen
Fremdschlüssel erlauben, prüft das Backend vor dem Speichern: Existiert die Zielressource? Ist
`target_type` gültig? Existiert der Favorit bereits? Darf der Nutzer diesen Inhalt favorisieren?

### Bewertungen (Reviews)

Verbindlich festgelegt (Design-Review Punkt 2): Sterne-Bewertung (1–5) und Kommentar bilden **eine**
gemeinsame Entität `reviews` — kein separates Kommentar-System. Jeder registrierte Nutzer kann pro
Location oder Artist eine eigene Bewertung mit Kommentar abgeben, später bearbeiten oder löschen.

Kommentare dienen ausschließlich dazu, aktuelle Eindrücke zu teilen (Stimmung, Wartezeit, Musik,
Publikum, allgemeiner Eindruck) — **keine Diskussionsplattform**: keine Antworten/Threads auf Kommentare,
keine Likes/Reaktionen, keine Erwähnungen (@), keine Hashtags, keine Social-Feed-Funktion.

Darstellung: chronologisch, sortierbar nach „Neueste" oder „Hilfreichste". Missbräuchliche Inhalte
können gemeldet (`review_flags`) und von Administratoren moderiert werden (siehe Kapitel 12/15).

> Offen: wie „Hilfreichste" operationalisiert wird — die Sortierung setzt ein Signal für Hilfreichkeit
> voraus, obwohl Likes/Reaktionen explizit ausgeschlossen sind. Muss vor Implementierung der Sortierung
> geklärt werden (siehe Kapitel 22).

## 17. Design

### Grundprinzipien
- Modernes iOS-Design mit Premium-Nightlife-Look
- **Nur Dark Mode** — kein Light Mode, weder in v1.0 noch in späteren Versionen. Dark Mode ist zentraler
  Bestandteil der Markenidentität, kein optionales Merkmal.
- Große, klare Karten (Cards) für Locations, Events, Künstler
- Moderne, reduzierte Navigation
- Dezente Glas-/Blur-Effekte, hochwertige Animationen, einheitliche Abstände, konsistente Komponenten
- Barrierefreiheit (Kontraste, Lesbarkeit) auch im Dark-Mode/Neon-Look mitdenken
- Performance: Karte und Live-Daten müssen auch bei schlechter mobiler Verbindung nutzbar bleiben

### Farbkonzept (Prinzip-Ebene)
- Eine dominante **Markenfarbe** (Neon-Akzent) für Branding, Logo, primäre Buttons, CTAs, aktive
  Navigation, Hervorhebungen.
- **Statusfarben** (🟢 wenig los / 🟡 gut besucht / 🔴 sehr voll) besitzen eine eigene Funktion und werden
  niemals für Branding verwendet.
- Weitere Akzentfarben nur unterstützend (Hinweise, Wetter, Services, Icons) — die Markenfarbe bleibt
  immer dominant.

> Konkrete Hex-Werte, Typografie-Hierarchie, Icon-Stil, Spacing-Muster und Komponenten-Bibliothek sind
> inzwischen in `docs/DesignSystem.md` dokumentiert (siehe Kapitel 21), abgeleitet aus den vom Product
> Owner bereitgestellten UI-Design-Entwürfen (`docs/ui-designs/`). Einzelne exakte Maße (px/pt-Werte,
> Schriftfamilie) bleiben dort weiterhin als offene Designentscheidung markiert, da sie aus den
> vorliegenden Standbildern nicht zweifelsfrei messbar sind.

## 18. Erfolgskennzahlen (KPIs)

Fokussierte KPI-Strategie für Version 1.0 — nur Kennzahlen, die konkrete Weiterentwicklungsentscheidungen
unterstützen.

### Produkt-KPIs
Registrierte Nutzer, täglich/wöchentlich/monatlich aktive Nutzer (DAU/WAU/MAU), durchschnittliche
Sitzungsdauer, Sitzungen pro Nutzer, Retention, Anzahl Favoriten, aktivierte Push-Benachrichtigungen.

### Community-KPIs
Abgegebene Community Reports, Reports pro Location, Anteil Locations mit aktuellen Live-Daten,
durchschnittliche Aktualität der Reports, durchschnittlicher Vertrauensscore, bestätigte/abgelehnte
Reports.

### Content-KPIs
Meistbesuchte Locations, beliebteste Künstler, meistangesehene Events, meistgenutzte Suchbegriffe/Filter,
beliebteste Happy Hours und Specials.

### Partner-KPIs
Anzahl verifizierter Partner-Locations, Anzahl veröffentlichter Specials/Happy Hours, Nutzung gesponserter
Inhalte (gewinnen an Bedeutung mit Einführung des Partnerprogramms).

Grundprinzipien: nur Kennzahlen mit klarem Nutzen für die Weiterentwicklung; DSGVO-Konformität; minimal
notwendige Verarbeitung personenbezogener Daten.

## 19. Roadmap

Relative Entwicklungsphasen statt fester Kalendertermine — die Roadmap orientiert sich am tatsächlichen
Projektfortschritt.

| Phase | Ziel | Umfang |
|---|---|---|
| 1 — Fundament | Technische Grundlage schaffen | Projektarchitektur, Design System, Datenbank, API, Authentifizierung, Grundnavigation, Backend, Basis-Komponenten |
| 2 — MVP | Erster veröffentlichungsfähiger Funktionsumfang | Home Dashboard, Live-Karte, Locations, Künstler, Events/Eventkalender, Favoriten, Community Reports, Live-Auslastung, Happy Hours, Push, Wetter |
| 3 — Optimierung | Stabilisierung nach Launch | Fehlerbehebungen, Performance, UX-Optimierungen, Verbesserungen auf Basis von Nutzerfeedback |
| 4 — Partnerprogramm (v2.0) | Erste Business-Funktionen | Location Manager, Partner-Dashboard, Verwaltung von Specials/Events, Premium-Platzierungen, gesponserte Inhalte |
| 5 — Plattformausbau (v3.0) | Langfristige Weiterentwicklung | KI-Auslastungsprognosen, Warteschlangen-Prognosen, erweiterte Analytics, Partnerplattform, Business Dashboard, weitere Regionen |

Grundprinzipien: die Roadmap orientiert sich am tatsächlichen Entwicklungsfortschritt; Qualität hat
Vorrang vor festen Veröffentlichungsterminen; neue Funktionen werden erst umgesetzt, wenn die vorherige
Phase stabil abgeschlossen ist; Änderungen an der Roadmap werden dokumentiert und begründet.

Der detaillierte, aufgabenbezogene Fortschritt wird separat in `TASKS.md` als Checkliste geführt.

## 20. Risiken

| Kategorie | Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|---|
| Produkt/Community | Zu wenige Community Reports in der Anfangsphase | Live-Auslastung anfangs weniger präzise | Redaktionell gepflegte Basisdaten, Vertrauensscore, Zeitgewichtung, Mehrfachbestätigung, aktive Community aufbauen |
| Produkt/Community | Missbrauch/absichtliche Falschmeldungen | Unzuverlässige Live-Daten | Login-Pflicht, Geofencing, Rate Limiting, Vertrauensscore, Moderation, automatische Missbrauchserkennung |
| Technik | Ausfall externer Dienste (Mapbox, OpenWeather, Firebase) | Einzelne Funktionen temporär nicht verfügbar | Zentrale Service-Architektur, nutzerfreundliche Fehlermeldungen, Retry-Mechanismen, austauschbarer Service Layer |
| Technik | Hohe Last in der Hauptsaison | Langsame Ladezeiten, verzögerte Live-Updates | TanStack-Query-Caching, gezielte Realtime-Nutzung, optimierte DB-Abfragen, Performance-Monitoring |
| Business | Partner-Locations beteiligen sich zunächst nur eingeschränkt | Weniger aktuelle Inhalte, langsamere Monetarisierung | Redaktionelle Pflege, einfaches Partnerprogramm, nachweisbarer Mehrwert, schrittweiser Ausbau |
| Rechtlich | Verarbeitung von Standort- und personenbezogenen Daten (Geofencing, Trust Score) | Datenschutzrechtliche Anforderungen | DSGVO-konforme Verarbeitung, transparente Datenschutzerklärung, Einwilligung für Standortzugriff, Speicherung nur notwendiger Daten (konkrete technische Umsetzung: siehe `docs/Architecture.md` Kapitel 17 „Sicherheit") |

Grundprinzipien: Risiken werden regelmäßig überprüft; Gegenmaßnahmen werden frühzeitig geplant; Qualität
und Datenschutz besitzen höchste Priorität; Risiken werden dokumentiert und bei Bedarf ergänzt.

## 21. Architektur-Dokumentation

`docs/Architecture.md` (technische Architektur, inkl. 12 im Detail geklärter Architekturentscheidungen)
und `docs/DesignSystem.md` (Design System auf Basis der finalen UI-Designs) sind erstellt und verbindlich.

Die begleitenden ADR-Dokumente werden einzeln, in numerischer Reihenfolge und ausschließlich auf Basis
bereits getroffener Entscheidungen erstellt:

```
docs/
└── ADR/
    ├── 001-State-Management.md      ✅ erstellt
    ├── 002-Authentication.md        ✅ erstellt
    ├── 003-Realtime.md              ✅ erstellt
    ├── 004-Database.md              ✅ erstellt
    ├── 005-API-Architecture.md      ✅ erstellt
    ├── 006-Maps.md                  🔴 geplant
    ├── 007-Notifications.md         🔴 geplant
    └── 008-Security.md              🔴 geplant
```

## 22. Offene Punkte

Diese Punkte sind bewusst noch nicht entschieden und müssen vor der jeweils betroffenen
Implementierung in einer eigenen Klärungsrunde festgelegt werden:

- Wie die „Hilfreichste"-Sortierung von Bewertungen (Kapitel 16 „Bewertungen (Reviews)") operationalisiert
  wird, obwohl Likes/Reaktionen explizit ausgeschlossen sind.
- Konkrete Indizes auf Datenbankebene — folgen bei der Migrationserstellung auf Basis des in Kapitel 16
  beschriebenen Datenmodells.

Kleinere, bereits eingegrenzte technische bzw. gestalterische Detailfragen (u. a. exakte px/pt-Maße,
Schriftfamilie, i18n-Bibliothek, Log-Level-Konzept, Aufbewahrungsfristen) sind in `docs/Architecture.md`
Kapitel 25 bzw. `docs/DesignSystem.md` Kapitel 25 gesammelt und werden dort weitergeführt, statt hier
dupliziert zu werden.
