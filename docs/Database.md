# Database — PlayaLive

> Status: geplante Struktur (Dokumentation) — kein SQL, keine Implementierung. Backend: Supabase
> (Postgres). Wird in der Architekturphase verfeinert und danach 1:1 umgesetzt.

## 1. Überblick

PlayaLive verwaltet Nutzer, Locations (Clubs/Bars), Künstler, Events, Favoriten, Community-Reports zur
Auslastung und Benachrichtigungen. Die folgenden Tabellen beschreiben die geplante Struktur auf
fachlicher Ebene (Felder, Beziehungen), ohne technisches Schema/SQL.

## 2. Tabellen

### 2.1 Users

Registrierte Nutzer der App.

- Felder (geplant): ID, E-Mail, Anzeigename, Profilbild, erstellt am
- Beziehungen: hat viele Favorites, hat viele Reports, empfängt viele Notifications

### 2.2 Locations

Clubs und Bars an der Playa de Palma.

- Felder (geplant): ID, Name, Beschreibung, Kategorie (Club/Bar), Adresse, Geokoordinaten (für Mapbox),
  Öffnungszeiten, Specials, aktuelles Auslastungslevel (Leer/Mittel/Voll, abgeleitet aus Reports), Bild(er)
- Beziehungen: hat viele Events, hat viele Reports, wird von vielen Users favorisiert

### 2.3 Artists

DJs/Künstler, die an der Playa de Palma auftreten.

- Felder (geplant): ID, Name, Beschreibung/Bio, Bild, Genre(s), Social-Media-Links
- Beziehungen: tritt bei vielen Events auf, wird von vielen Users favorisiert

### 2.4 Events

Veranstaltungen an einer Location.

- Felder (geplant): ID, Titel, Beschreibung, Location-Referenz, Startzeit, Endzeit, Datum, Bild
- Beziehungen: gehört zu einer Location, hat einen oder mehrere Artists (Zuordnungstabelle
  Event↔Artist), wird von vielen Users favorisiert (über Favorites)

### 2.5 Favorites

Von Nutzern gespeicherte Locations oder Artists.

- Felder (geplant): ID, User-Referenz, Ziel-Typ (Location/Artist), Ziel-Referenz, erstellt am
- Beziehungen: gehört zu einem User, verweist auf eine Location oder einen Artist

### 2.6 Reports

Community-Meldungen zur aktuellen Auslastung einer Location.

- Felder (geplant): ID, User-Referenz, Location-Referenz, gemeldetes Auslastungslevel (Leer/Mittel/Voll),
  Zeitstempel
- Beziehungen: gehört zu einem User, gehört zu einer Location
- Hinweis: aktuelles Auslastungslevel einer Location wird aus aktuellen/aggregierten Reports abgeleitet
  (Aggregationslogik wird in der Architekturphase festgelegt)

### 2.7 Notifications

Benachrichtigungen für Nutzer (z. B. zu Favoriten, Events, Specials).

- Felder (geplant): ID, User-Referenz, Typ (z. B. Favoriten-Update, Event startet bald, Special),
  Bezugs-Objekt (Location/Artist/Event), Titel, Nachricht, gelesen (Ja/Nein), erstellt am
- Beziehungen: gehört zu einem User, verweist optional auf Location/Artist/Event

## 3. Entity-Relationship-Übersicht (fachlich)

- User —< Favorites >— Location / Artist
- User —< Reports >— Location
- User —< Notifications
- Location —< Events
- Event >—< Artists (viele-zu-viele)

_TODO — grafisches ER-Diagramm, sobald Datenmodell final abgestimmt ist_

## 4. Row-Level-Security (RLS)

_TODO — u. a.: Reports/Favorites nur durch den eigenen User schreibbar, Locations/Events/Artists
öffentlich lesbar, Notifications nur für eigenen User sichtbar_

## 5. Indizes & Performance

_TODO — z. B. Index auf Location-Geokoordinaten, Reports nach Location + Zeitstempel_

## 6. Realtime-Kanäle

_TODO — Realtime-Subscriptions insbesondere für Reports (Live-Auslastung) und Notifications_

## 7. Storage-Buckets

_TODO — Bilder für Locations, Artists, Events, Profilbilder_

## 8. Migrationen

_TODO — wird nach Festlegung des finalen Schemas begonnen (kein SQL in diesem Dokument)_
