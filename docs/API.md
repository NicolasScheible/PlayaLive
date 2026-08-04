# API — PlayaLive

> Status: geplante Struktur (Dokumentation) — keine Implementierung. Zugriff voraussichtlich über den
> Supabase-Client (Postgres-Tabellen + Realtime), ggf. ergänzt um Supabase Edge Functions für
> serverseitige Logik (z. B. Auslastungs-Aggregation). Endgültige Zugriffsstrategie wird in der
> Architekturphase festgelegt.

## 1. Überblick

Die API-Struktur orientiert sich an den Tabellen aus `docs/Database.md`. Jeder Bereich beschreibt, welche
Operationen fachlich benötigt werden — nicht deren technische Umsetzung.

## 2. Authentication

- Registrierung (E-Mail/Passwort, ggf. Social Login)
- Login / Logout
- Passwort-Reset
- Aktuelle Session/Nutzer abrufen
- Nutzerprofil aktualisieren (Anzeigename, Profilbild)

## 3. Locations

- Liste aller Locations abrufen (für Live Map)
- Location-Details abrufen (inkl. aktuellem Auslastungslevel, Öffnungszeiten, Specials)
- Locations nach Kategorie (Club/Bar) filtern
- Locations nach Nähe/Geokoordinaten abfragen (für Kartenausschnitt)

## 4. Events

- Liste kommender Events abrufen (Tagesprogramm, kommende Events)
- Event-Details abrufen (inkl. zugeordneter Location und Artists)
- Events nach Location filtern
- Events nach Datum/Zeitraum filtern

## 5. Artists

- Liste aller Artists abrufen
- Artist-Details abrufen (Bio, Genres, Auftritte)
- Auftritte (Events) eines Artists abrufen

## 6. Favorites

- Favorit hinzufügen (Location oder Artist)
- Favorit entfernen
- Eigene Favoriten abrufen (Locations und Artists getrennt oder kombiniert)

## 7. Reports

- Community-Report zur Auslastung einer Location erstellen
- Aktuelle/aggregierte Reports einer Location abrufen
- Eigene abgegebene Reports abrufen (optional, z. B. zur Missbrauchsvermeidung)

## 8. Notifications

- Eigene Benachrichtigungen abrufen
- Benachrichtigung als gelesen markieren
- Benachrichtigungseinstellungen abrufen/aktualisieren
- Push-Token registrieren/aktualisieren (Firebase Notifications)

## 9. Realtime-Subscriptions

_TODO — insbesondere: Auslastungsänderungen pro Location (aus Reports), neue Notifications_

## 10. Fehlerbehandlung

_TODO — einheitliches Fehlerformat, Umgang mit Auth-Fehlern, Netzwerkfehlern, leeren Ergebnissen_

## 11. Rate Limiting & Sicherheit

_TODO — insbesondere Schutz vor Report-Spam/Missbrauch (z. B. ein Report pro User/Location/Zeitfenster)_
