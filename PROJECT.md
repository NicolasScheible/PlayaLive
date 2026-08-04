# PROJECT.md — PlayaLive

## Projektbeschreibung

PlayaLive ist eine mobile App (React Native / Expo), die Besuchern von **Playa de Palma, Mallorca** in
Echtzeit zeigt, was gerade im Nightlife- und Party-Geschehen der Region passiert: Clubs, Bars, Events,
Künstler, Auslastung, Öffnungszeiten, Specials und Community-Meldungen.

Kernidee: Statt selbst herumzufragen oder zu raten, sieht der Nutzer auf einen Blick, wo gerade etwas los
ist, wie voll welche Location ist, welche Events und Künstler heute laufen — und kann direkt hingehen.

## Vision

PlayaLive ist die zentrale Live-App für Besucher von Playa de Palma.

Die App zeigt in Echtzeit:
- Clubs
- Bars
- Events
- Künstler
- Partystimmung
- Auslastung
- Öffnungszeiten
- Specials
- Community-Meldungen

Ziel ist, dass Nutzer jederzeit wissen: **"Was passiert gerade in Playa de Palma und wo lohnt es sich
hinzugehen?"**

Langfristig soll PlayaLive:
- die verlässlichste Live-Datenquelle für das Nightlife an der Playa de Palma sein,
- eine aktive Community aufbauen, die Auslastung und Stimmung in Echtzeit meldet,
- Clubs, Bars und Veranstaltern eine Plattform bieten, um Events, Künstler und Specials sichtbar zu
  machen.

## Zielgruppe

- Urlauber auf Mallorca
- Partyurlauber
- Junge Erwachsene
- Gruppen (Freundesgruppen, Junggesellenabschiede etc.)
- Eventbesucher
- Besucher von Clubs und Bars

## MVP (Minimum Viable Product)

1. **Live Map** — Karte mit Clubs/Bars an der Playa de Palma, Live-Auslastung (Leer/Mittel/Voll)
2. **Events** — Tagesprogramm, kommende Events, Künstler, Startzeiten
3. **Künstlerprofile** — DJs, Auftritte, Favoriten
4. **Favoriten** — Locations und Künstler speichern, Benachrichtigungen erhalten
5. **Community Reports** — Nutzer melden Auslastung, Echtzeit-Updates
6. **Wetter** — Temperatur, Wetterbedingungen

## Hauptfunktionen

### 1. Live Map
- Karte mit Locations (Clubs und Bars)
- Live-Auslastung pro Location
- Auslastungs-Status: Leer / Mittel / Voll

### 2. Events
- Tagesprogramm
- Kommende Events
- Künstler pro Event
- Startzeiten

### 3. Künstlerprofile
- DJs
- Auftritte (aktuelle und kommende)
- Favoriten

### 4. Favoriten
- Locations speichern
- Künstler speichern
- Benachrichtigungen bei Neuigkeiten zu Favoriten

### 5. Community Reports
- Nutzer melden aktuelle Auslastung einer Location
- Echtzeit-Updates für andere Nutzer sichtbar

### 6. Wetter
- Temperatur
- Wetterbedingungen

## Technologie-Stack

- **Frontend:** React Native mit Expo (TypeScript)
- **Navigation:** React Navigation
- **Backend/Datenbank:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- **Karten:** Mapbox
- **Push Notifications:** Firebase Notifications
- **State Management:** wird in der Architekturphase festgelegt, kein Overengineering
- **Sprache:** TypeScript durchgängig (Frontend und ggf. Edge Functions)

Details und Begründungen folgen in `docs/Database.md` und `docs/API.md`, sobald die Architekturphase
beginnt.

## Design-Richtlinien

Modernes iOS-Design mit Premium-Nightlife-Look:

- Dark Mode als Basis
- Neon-Akzente
- Große, klare Karten (Cards) für Locations, Events und Künstler
- Moderne, reduzierte Navigation
- Mobile-first, große Touch-Ziele, viel visuelle Information (Karte, Icons, Badges für Auslastung)
- Konsistente Komponentenbibliothek statt Einzellösungen pro Screen
- Barrierefreiheit (Kontraste, Lesbarkeit) auch im Dark-Mode/Neon-Look mitdenken
- Performance: Karte und Live-Daten müssen auch bei schlechter mobiler Verbindung nutzbar bleiben

Details folgen in `docs/Design.md`.

## Entwicklungsprinzipien

- **Erst Fundament, dann Code:** Planung, Architektur und Dokumentation vor Implementierung (aktuelle
  Phase)
- **MVP-first:** Kernfunktionen zuerst, keine Feature-Anhäufung vor einem lauffähigen MVP
- **Einfachheit vor Abstraktion:** keine vorzeitigen Abstraktionen oder Architektur für hypothetische
  Zukunftsfälle
- **Konsistenz:** einheitliche Namenskonventionen, Ordnerstruktur und Code-Stil (siehe `CLAUDE.md`)
- **Nachvollziehbarkeit:** Entscheidungen werden dokumentiert (`docs/`), nicht nur im Code versteckt
- **Iterativ:** kleine, überprüfbare Schritte statt großer Big-Bang-Änderungen
