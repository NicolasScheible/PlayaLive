# Database — PlayaLive

> Status: geplante Struktur (Dokumentation) — kein SQL, keine Implementierung. Backend: Supabase
> (Postgres). Alle inhaltlichen Entscheidungen sind mit dem Product Owner abgestimmt und in
> `docs/PRD.md` (Kapitel 15–16) verbindlich dokumentiert; dieses Dokument fasst sie datenbanknah
> zusammen. Konkrete SQL-Migrationen entstehen erst in der Umsetzungsphase über Supabase-CLI-Migrationen
> (siehe Kapitel 8).

## 1. Überblick

PlayaLive verwaltet Nutzer, Locations (Clubs/Bars), Künstler, Events, Specials, Happy Hours, Favoriten,
Community-Reports zur Auslastung, das Vertrauenssystem, Bewertungen (Reviews), Benachrichtigungen und
(ab v2.x) Partner. Die folgenden Tabellen beschreiben die geplante Struktur auf fachlicher Ebene (Felder,
Beziehungen), ohne technisches Schema/SQL.

## 2. Tabellen

### 2.1 Profiles

Erweitert die Supabase-Auth-Nutzer um App-spezifische Daten. Login ist ab v1.0 verpflichtend, es gibt
keinen Gastzugriff (siehe `docs/PRD.md` Kapitel 12).

- Felder (geplant): id, E-Mail, Anzeigename, Profilbild, Rolle (`user` / `location_manager` [v2.x] /
  `admin` / `super_admin`), trust_score, trust_level, reports_count, confirmed_reports,
  rejected_reports, erstellt am, aktualisiert am
- Beziehungen: hat viele Favorites, hat viele Reports, hat viele Report Flags, hat viele
  Trust-Score-Events, empfängt viele Notifications, hat viele Reviews, hat viele Review Flags

### 2.2 Trust Score Events

Vollständige Historie jeder Änderung des Vertrauensscores eines Nutzers (siehe `docs/PRD.md` →
Vertrauenssystem).

- Felder (geplant): id, User-Referenz, vorheriger Score, neuer Score, Punkteänderung, Grund,
  Bezugstyp, Bezugs-ID, erstellt am, erstellt von
- Beziehungen: gehört zu einem Profile

### 2.3 Locations

Clubs und Bars an der Playa de Palma.

- Felder (geplant): ID, Name, Beschreibung, Kategorie (Club/Bar), Adresse, Geokoordinaten (für Mapbox),
  Öffnungszeiten, Bild(er), gesponsert (Ja/Nein), gesponsert bis, Owner-Referenz (Location Manager,
  v2.x), erstellt von, erstellt am, aktualisiert am, gelöscht am (Soft Delete)
- Beziehungen: hat viele Events, hat viele Specials, hat viele Happy Hours, hat viele Reports, wird von
  vielen Profiles favorisiert (über Favorites)

### 2.4 Artists

DJs/Künstler, die an der Playa de Palma auftreten.

- Felder (geplant): ID, Name, Beschreibung/Bio, Bild, Genre(s), Social-Media-Links, erstellt am,
  aktualisiert am, gelöscht am (Soft Delete)
- Beziehungen: tritt bei vielen Events auf (über Event-Artists), wird von vielen Profiles favorisiert

### 2.5 Events

Veranstaltungen an einer Location.

- Felder (geplant): ID, Titel, Beschreibung, Location-Referenz, Startzeit, Endzeit, Bild, gesponsert
  (Ja/Nein), erstellt von, erstellt am, aktualisiert am, gelöscht am (Soft Delete)
- Beziehungen: gehört zu einer Location, hat einen oder mehrere Artists (Zuordnungstabelle
  Event↔Artist), wird von vielen Profiles favorisiert (über Favorites)

### 2.6 Event Artists

Zuordnungstabelle für die n:m-Beziehung zwischen Events und Artists.

- Felder (geplant): Event-Referenz, Artist-Referenz

### 2.7 Specials

Zeitlich begrenzte Aktionen/Angebote einer Location (z. B. Ladies Night, VIP Event, Sonderveranstaltung).

- Felder (geplant): ID, Location-Referenz, Titel, Beschreibung, Bild, Kategorie, Start-/Enddatum,
  Start-/Endzeit, wiederkehrend (Ja/Nein), gesponsert (Ja/Nein), Priorität, aktiv (Ja/Nein), erstellt am,
  aktualisiert am
- Beziehungen: gehört zu einer Location

### 2.8 Happy Hours

Regelmäßig wiederkehrende Angebote einer Location — bewusst getrennt von Specials modelliert, da sie
wochentagsbasiert wiederkehren statt an ein festes Datum gebunden zu sein.

- Felder (geplant): ID, Location-Referenz, Titel, Beschreibung, Wochentag, Start-/Endzeit, Angebotstext,
  gesponsert (Ja/Nein), Priorität, aktiv (Ja/Nein), erstellt am, aktualisiert am
- Beziehungen: gehört zu einer Location

### 2.9 Favorites

Von Nutzern gespeicherte Locations, Artists oder Events — eine zentrale, polymorphe Tabelle statt
getrennter Tabellen je Typ (siehe `docs/PRD.md` → Favoriten-Modell für Begründung und
Integritätsprüfung).

- Felder (geplant): ID, User-Referenz, Ziel-Typ (`location` / `artist` / `event`), Ziel-Referenz,
  erstellt am, aktualisiert am
- Beziehungen: gehört zu einem Profile, verweist (ohne klassischen Fremdschlüssel, serverseitig
  geprüft) auf eine Location, einen Artist oder ein Event

### 2.10 Reports

Community-Meldungen zur aktuellen Auslastung, Wartezeit und Stimmung einer Location.

- Felder (geplant): ID, User-Referenz, Location-Referenz, gemeldetes Auslastungslevel, Wartezeit,
  Stimmung, Musikrichtung, optionaler Kommentar, Geokoordinaten (zur Geofencing-Prüfung), Zeitstempel
- Beziehungen: gehört zu einem Profile, gehört zu einer Location, kann mehrere Report Flags haben
- Aggregationslogik (Zeitgewichtung, Vertrauensscore, Mindestanzahl, Mehrfachbestätigung): siehe
  `docs/PRD.md` → Community-Report-Aggregation

### 2.11 Report Flags

Meldungen von Nutzern zu verdächtigen/falschen Reports (Teil des Missbrauchsschutzes).

- Felder (geplant): ID, Report-Referenz, meldender User, Grund, erstellt am
- Beziehungen: gehört zu einem Report, gehört zu einem meldenden Profile

### 2.12 Reviews

Bewertung mit Kommentar zu einer Location oder einem Artist (Sterne-Bewertung und Kommentar bilden eine
gemeinsame Entität, kein separates Kommentar-System — siehe `docs/PRD.md` Kapitel 16 „Bewertungen
(Reviews)"). Kommentare dienen ausschließlich dem Teilen aktueller Eindrücke (Stimmung, Wartezeit, Musik,
Publikum, allgemeiner Eindruck) — keine Diskussionsplattform (keine Antworten/Threads, keine Likes/
Reaktionen, keine Erwähnungen, keine Hashtags).

- Felder (geplant): ID, User-Referenz, Ziel-Typ (`location` / `artist`), Ziel-Referenz, Bewertung (1–5),
  Kommentartext, erstellt am, aktualisiert am, gelöscht am (Soft Delete)
- Beziehungen: gehört zu einem Profile, verweist (serverseitig geprüft, wie bei Favorites) auf eine
  Location oder einen Artist, kann mehrere Review Flags haben
- Darstellung: chronologisch, sortierbar nach „Neueste" oder „Hilfreichste" — wie „Hilfreichste"
  operationalisiert wird, ist trotz explizit ausgeschlossener Likes/Reaktionen noch offen (siehe
  `docs/PRD.md` Kapitel 22 „Offene Punkte")

### 2.13 Review Flags

Meldungen von Nutzern zu missbräuchlichen Reviews (Teil des Moderationsprozesses, analog zu
`report_flags`).

- Felder (geplant): ID, Review-Referenz, meldender User, Grund, erstellt am
- Beziehungen: gehört zu einem Review, gehört zu einem meldenden Profile

### 2.14 Notifications

Benachrichtigungen für Nutzer (z. B. zu Favoriten, Events, Specials, Happy Hours).

- Felder (geplant): ID, User-Referenz, Typ (z. B. Favoriten-Update, Event startet bald, Special/Happy
  Hour), Bezugs-Objekt (Location/Artist/Event), Titel, Nachricht, gelesen (Ja/Nein), erstellt am
- Beziehungen: gehört zu einem Profile, verweist optional auf Location/Artist/Event

### 2.15 Partners (v2.x)

Verknüpfung eines Profiles (Rolle `location_manager`) mit der von ihm verwalteten, verifizierten
Location. Nicht Teil des MVP.

- Felder (geplant): ID, User-Referenz, Location-Referenz, Status, verifiziert am, erstellt am
- Beziehungen: gehört zu einem Profile, gehört zu einer Location

## 3. Entity-Relationship-Übersicht (fachlich)

- Profile —< Favorites >— Location / Artist / Event (polymorph über `target_type`)
- Profile —< Reports >— Location
- Profile —< Report Flags >— Reports
- Profile —< Trust Score Events
- Profile —< Notifications
- Profile —< Reviews >— Location / Artist (polymorph über `target_type`)
- Profile —< Review Flags >— Reviews
- Location —< Events
- Location —< Specials
- Location —< Happy Hours
- Event >—< Artists (über Event Artists, n:m)
- Profile —< Partners >— Location (v2.x)

## 4. Row-Level-Security (RLS)

Grundprinzip „Security by Default" (Deny by Default, jede Berechtigung explizit über Policies) sowie die
rollenbasierten Berechtigungen je Tabelle (User / Location Manager / Admin / Super Admin) sind
verbindlich in `docs/PRD.md` → Kapitel 15 „Row-Level-Security (Supabase)" beschrieben. Die konkrete
Policy-Formulierung je Tabelle erfolgt bei der Migrationserstellung.

## 5. Indizes & Performance

_TODO — konkrete Indizes werden bei der Migrationserstellung auf Basis des obigen Datenmodells
festgelegt, u. a. voraussichtlich: Index auf Location-Geokoordinaten, Reports nach Location + Zeitstempel,
Favorites nach User + Ziel-Typ._

## 6. Realtime-Kanäle

Aktiviert für: Reports (Live-Auslastung), Notifications, Events, Specials & Happy Hours, sowie die
Live-Daten-Felder von Locations (nicht deren Stammdaten). Details, Begründung und Architektur (zentraler
Realtime Service) siehe `docs/PRD.md` → Kapitel 15 „Realtime-Kanäle".

## 7. Storage-Buckets

Ein Bucket pro Entitätstyp (`locations`, `artists`, `events`, `profiles`, `specials`, `system`) mit
eigenen Policies. Details siehe `docs/PRD.md` → Kapitel 15 „Storage-Buckets".

## 8. Migrationen

Sämtliche Schemaänderungen ausschließlich über versionierte Supabase-CLI-Migrationen, verwaltet im
Git-Repository unter `supabase/migrations/`, niemals direkt über das Supabase-Dashboard. Details siehe
`docs/PRD.md` → Kapitel 15 „Migrationen". Der Zugriff auf diese Tabellen aus dem App-Code erfolgt
ausschließlich über den Service Layer (bei geschäftslogiklastigen Bereichen zusätzlich über das
Repository Pattern) — siehe `docs/Architecture.md` Kapitel 8–9.
