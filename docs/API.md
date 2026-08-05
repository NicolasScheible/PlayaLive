# API — PlayaLive

> Status: geplante Struktur (Dokumentation) — keine Implementierung. Zugriff über den Supabase-Client
> (Postgres-Tabellen + Realtime) und Supabase Edge Functions (serverseitige Logik, z. B.
> Auslastungs-Aggregation, Vertrauensscore-Berechnung). Alle Backendzugriffe laufen im Frontend
> ausschließlich über den in `docs/PRD.md` (Kapitel 15) beschriebenen Service Layer — nie direkt aus
> Screens/Komponenten.

## 1. Überblick

Die API-Struktur orientiert sich an den Tabellen aus `docs/Database.md`. Jeder Bereich beschreibt, welche
Operationen fachlich benötigt werden — nicht deren technische Umsetzung.

## 2. Authentication

Login ist ab v1.0 verpflichtend, es gibt keinen Gastzugriff (siehe `docs/PRD.md` Kapitel 12).

- Registrierung/Login via Apple Sign-In, Google Sign-In oder E-Mail & Passwort
- Logout
- Passwort-Reset
- Aktuelle Session/Nutzer abrufen
- Nutzerprofil aktualisieren (Anzeigename, Profilbild)

## 3. Locations

- Liste aller Locations abrufen (für Live Map)
- Location-Details abrufen (inkl. aktuellem Auslastungslevel, Öffnungszeiten, Specials, Happy Hours)
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

## 6. Specials & Happy Hours

- Aktuell gültige Specials/Happy Hours einer Location abrufen
- Specials/Happy Hours nach Location filtern
- Specials/Happy Hours nach Kategorie/Zeitraum filtern

## 7. Favorites

Favoriten werden über eine zentrale, polymorphe Tabelle abgebildet (siehe `docs/Database.md` → 2.9).

- `addFavorite(type, id)` — Favorit hinzufügen (Location, Artist oder Event)
- `removeFavorite(type, id)` — Favorit entfernen
- `toggleFavorite(type, id)`
- `getFavorites(type)` — eigene Favoriten abrufen, optional nach Typ gefiltert

## 8. Reports

- Community-Report zur Auslastung/Wartezeit/Stimmung/Musikrichtung (optional mit Kommentar) einer
  Location erstellen — über den zentralen Schnellzugriff-Button der Bottom Navigation (`docs/PRD.md`
  Kapitel 11), serverseitig geprüft: Login, Rate Limiting, Geofencing (siehe `docs/PRD.md` →
  Missbrauchsschutz)
- Aktuellen, aggregierten Live-Status einer Location abrufen (Zeitgewichtung, Vertrauensscore,
  Mehrfachbestätigung — siehe `docs/PRD.md` → Community-Report-Aggregation)
- Eigene abgegebene Reports abrufen
- Verdächtigen Report melden (`report_flags`)

## 9. Reviews

- Eigene Bewertung (1–5 Sterne + Kommentar) zu einer Location oder einem Artist erstellen
- Eigene Bewertung bearbeiten oder löschen
- Bewertungen zu einer Location/einem Artist abrufen, sortierbar nach „Neueste" oder „Hilfreichste"
  (Operationalisierung von „Hilfreichste" noch offen — siehe `docs/PRD.md` Kapitel 22)
- Eigene abgegebene Bewertungen abrufen (für die Profilübersicht, analog zu „Eigene abgegebene Reports
  abrufen" in Kapitel 8)
- Missbräuchliche Bewertung melden (`review_flags`)

## 10. Notifications

- Eigene Benachrichtigungen abrufen
- Benachrichtigung als gelesen markieren
- Benachrichtigungseinstellungen abrufen/aktualisieren
- Push-Token registrieren/aktualisieren (Firebase Notifications)

## 11. Weather

- Aktuelles Wetter (Temperatur, gefühlte Temperatur, Wetterzustand, Regenwahrscheinlichkeit,
  Windgeschwindigkeit, Luftfeuchtigkeit, UV-Index, Sonnenauf-/-untergang) für Playa de Palma abrufen —
  ausschließlich über den `WeatherService` (Anbieter: OpenWeather API, austauschbar, siehe
  `docs/PRD.md` → Kapitel 14)

## 12. Realtime-Subscriptions

Realtime wird gezielt für zeitkritische Daten eingesetzt: Reports (Live-Auslastung), Notifications,
Events, Specials & Happy Hours, sowie die Live-Daten-Felder von Locations. Alle Subscriptions laufen
über den zentralen Realtime Service, der den TanStack-Query-Cache aktualisiert — nie direkt in
Screens/Komponenten. Details siehe `docs/PRD.md` → Kapitel 15 „Realtime-Kanäle".

## 13. Fehlerbehandlung

Zentrale Fehlerbehandlung im Service Layer, einheitliches Fehlerformat, nutzerfreundliche statt
technische Fehlermeldungen, automatische Retries nur bei temporären Netzwerkfehlern, klar definierte
Screen-Zustände (Loading/Success/Empty/Error). Details siehe `docs/PRD.md` → Kapitel 15
„Fehlerbehandlung". Das konkrete `AppError`-Format und der domänenstrukturierte Fehlercode-Katalog sind
in `docs/Architecture.md` Kapitel 15 dokumentiert.

## 14. Rate Limiting & Sicherheit

Schutz insbesondere für Community Reports: Login-Pflicht, Rate Limiting (max. ein Report pro Nutzer und
Location je Zeitfenster), Geofencing, Vertrauensscore-Gewichtung, Meldefunktion, automatische
Missbrauchserkennung. Alle Prüfungen erfolgen serverseitig. Details siehe `docs/PRD.md` → Kapitel 15
„Missbrauchsschutz bei Community Reports". Autorisierung aller Endpunkte zusätzlich über Row-Level-
Security (siehe `docs/Database.md` → 4.). Secrets-Verwaltung und weitere sicherheitsrelevante
Architekturentscheidungen (Umgebungen, EAS Secrets) siehe `docs/Architecture.md` Kapitel 17.
