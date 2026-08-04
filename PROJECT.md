# PROJECT.md — PlayaLive

> Hinweis: Dieses Dokument definiert die inhaltliche Grundlage von PlayaLive. Da zu Projektbeginn noch keine
> detaillierte Spezifikation vorlag, wurden sinnvolle Annahmen getroffen (insbesondere zu Zielgruppe und
> Kernfunktionen). Diese Annahmen sind explizit markiert und sollten mit dem Projektverantwortlichen
> abgeglichen und bei Bedarf angepasst werden.

## Projektbeschreibung

PlayaLive ist eine mobile App (React Native / Expo), die Strand- und Küstenbesuchern in Echtzeit
Informationen über Strände liefert und eine soziale Komponente bietet, um Erlebnisse am Strand zu teilen
und zu koordinieren.

Kernidee: Bevor oder während man an den Strand fährt, sieht man auf einer Karte den aktuellen Zustand
verschiedener Strände (Andrang, Wetter, Wasserbedingungen, Sicherheitshinweise/Flaggen) und kann sich mit
anderen Nutzern live austauschen (Check-ins, Fotos, Status-Updates, Events).

*(Annahme: "Playa" = spanisch für Strand. Der Fokus liegt auf Strand-/Küstenregionen. Falls eine andere
Bedeutung/Ausrichtung gemeint ist, bitte in PROJECT.md korrigieren.)*

## Vision

PlayaLive soll die zentrale App für alles rund um den Strandbesuch werden: Nutzer sollen in Sekunden
wissen, wie voll ein Strand ist, wie das Wetter und die Wasserbedingungen sind, ob es Sicherheitswarnungen
gibt, und was gerade dort passiert (Events, Treffen, Aktivitäten) — live und community-getrieben statt
statisch.

Langfristig soll PlayaLive:
- die verlässlichste Live-Datenquelle für Strände in der Zielregion sein,
- eine aktive, hilfsbereite Community aus Strandgängern aufbauen,
- lokalen Anbietern (Beachclubs, Rettungsschwimmer, Veranstalter) eine Plattform bieten, um Informationen
  und Events zu teilen.

## Zielgruppe

- **Primär:** Strandgänger und Wassersportler (Schwimmer, Surfer, Familien), die regelmäßig Strände
  besuchen und aktuelle Informationen vor Ort brauchen.
- **Sekundär:** Touristen, die eine Region nicht kennen und Orientierung zu Stränden suchen.
- **Tertiär (später):** Lokale Anbieter (Beachbars, Rettungsschwimmer-Stationen, Event-Veranstalter), die
  Informationen offiziell bereitstellen möchten.

*(Annahme, bitte bei Bedarf präzisieren: Altersgruppe, Region/Land, Sprache(n).)*

## MVP (Minimum Viable Product)

Der MVP soll den Kernnutzen so schlank wie möglich demonstrieren:

1. Kartenansicht mit Stränden in der Nähe (Mapbox)
2. Detailansicht pro Strand: aktuelle Bedingungen (manuell/community-gepflegt oder externe Quelle),
   Andrang-Einschätzung
3. Nutzer-Check-in an einem Strand
4. Einfache Live-Statusmeldungen von Nutzern (Text + optional Foto) pro Strand
5. Registrierung/Login (Supabase Auth)
6. Push-Benachrichtigungen für ausgewählte Strände (z. B. neue Meldung, Warnung)

Alles darüber hinaus (Events, Chat, Beachclub-Profile, Gamification, Freundesystem etc.) ist Post-MVP.

## Hauptfunktionen (Gesamtübersicht, über MVP hinaus)

- Interaktive Karte mit allen erfassten Stränden
- Live-Strandstatus: Andrang, Wetter, Wassertemperatur, Wellenbedingungen, Sicherheitsflaggen
- Community Check-ins und Live-Updates (Text/Foto)
- Strand-Detailseiten mit Historie und Bewertungen
- Events an Stränden (z. B. Beachvolleyball, Konzerte, Treffen)
- Freunde/Follow-System, um zu sehen wer wo ist
- Push-Benachrichtigungen (Warnungen, Freunde in der Nähe, Events)
- Benutzerprofile
- (Später) Verifizierte Anbieter-Accounts für offizielle Informationen

## Technologie-Stack

- **Frontend:** React Native mit Expo (TypeScript)
- **Navigation:** React Navigation
- **Backend/Datenbank:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions)
- **Karten:** Mapbox
- **State Management:** wird in der Architekturphase festgelegt (z. B. Zustand oder React Query +
  Context), kein Overengineering
- **Push Notifications:** Expo Notifications
- **Sprache:** TypeScript durchgängig (Frontend und ggf. Edge Functions)

Details und Begründungen folgen in `docs/Database.md` und `docs/API.md`, sobald die Architekturphase
beginnt.

## Design-Richtlinien

- Klar, hell, "sommerlich" — an Strand/Wasser/Sonne angelehnte Farbwelt (Details folgen in
  `docs/Design.md`)
- Mobile-first, große Touch-Ziele, wenig Text, viel visuelle Information (Karte, Icons, Badges)
- Konsistente Komponentenbibliothek statt Einzellösungen pro Screen
- Barrierefreiheit (Kontraste, Lesbarkeit) von Anfang an mitdenken
- Performance: Karte und Live-Daten müssen auch bei schlechter mobiler Verbindung nutzbar bleiben

## Entwicklungsprinzipien

- **Erst Fundament, dann Code:** Planung, Architektur und Dokumentation vor Implementierung (aktuelle
  Phase)
- **MVP-first:** Kernfunktionen zuerst, keine Feature-Anhäufung vor einem lauffähigen MVP
- **Einfachheit vor Abstraktion:** keine vorzeitigen Abstraktionen oder Architektur für hypothetische
  Zukunftsfälle
- **Konsistenz:** einheitliche Namenskonventionen, Ordnerstruktur und Code-Stil (siehe `CLAUDE.md`)
- **Nachvollziehbarkeit:** Entscheidungen werden dokumentiert (`docs/`), nicht nur im Code versteckt
- **Iterativ:** kleine, überprüfbare Schritte statt großer Big-Bang-Änderungen
