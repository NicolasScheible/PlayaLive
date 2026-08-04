# ADR-006: Maps

## Status

Accepted

## Datum

2026-08-04

## Kontext

Der Map Screen ist einer der zentralen Einstiegspunkte in PlayaLive: Nutzer sehen dort Clubs/Bars an der
Playa de Palma mit ihrer aktuellen Live-Auslastung. Die Karte muss auch bei schlechter mobiler Verbindung
(Hauptsaison, volle Netze) nutzbar bleiben und darf bei einer für Playa de Palma überschaubaren Anzahl an
Locations keine unnötige technische Komplexität einführen.

## Problemstellung

Welcher Kartendienst wird für PlayaLive verwendet, wie werden viele Location-Marker performant
dargestellt (Clustering), und welche Performance-Ziele gelten für Kartendarstellung und -interaktion?

## Entscheidung

- **Kartendienst:** Mapbox, für Geokoordinaten-Darstellung der Locations (Clubs/Bars) im Map Screen.
- **Kartenclustering:** ausschließlich das native Clustering von Mapbox, ohne zusätzliche Drittanbieter-
  Bibliothek. Cluster lösen sich automatisch auf, sobald weit genug hineingezoomt wird.
- **Performance-Ziele für Version 1.0:**

| Bereich | Ziel |
|---|---|
| App-Start bis nutzbare Oberfläche | < 3 s auf aktuellen Mittelklasse-Geräten |
| Screen-Wechsel | < 300 ms |
| Listen (Locations, Events, Künstler) | Datenanzeige ≤ 1 s bei normaler Verbindung |
| Kartenbewegungen (Scrollen, Zoomen, Marker-Animationen) | möglichst 60 fps |
| Realtime-Updates | dürfen die UI nicht sichtbar blockieren |

- Diese Werte sind laufend zu überprüfende Qualitätsziele, kein einmaliger nachträglicher
  Optimierungsschritt; neue Funktionen dürfen die Kartenperformance nicht spürbar verschlechtern.
- **Performance-Monitoring:** Sentry Performance Monitoring im Betrieb, ergänzt während der Entwicklung
  um den React-Native-Performance-Profiler und Expo-Performance-Tools.
- Live-Auslastungsdaten pro Location auf der Karte werden über den zentralen Realtime Service
  aktualisiert (siehe ADR-003), nicht durch eigene Polling-Logik der Karte.

## Begründung

Mapbox war bereits als Kartendienst im Tech-Stack festgelegt (`PROJECT.md`). Das native Mapbox-Clustering
deckt die für die Playa de Palma realistische, überschaubare Anzahl an Locations vollständig ab, ohne eine
zusätzliche Clustering-Bibliothek mit eigenem Wartungsaufwand und potenziellen Kompatibilitätsproblemen
einzuführen — bei deutlichem Wachstum in späteren Versionen kann die Strategie bei Bedarf erweitert
werden, ohne dass dies für Version 1.0 vorweggenommen werden muss. Feste, messbare Performance-Ziele
verhindern, dass Kartenperformance als „kümmern wir uns später drum" behandelt wird, und schaffen eine
überprüfbare Grundlage während der gesamten Entwicklung statt eines unklaren „soll flüssig sein".

## Konsequenzen

- Für Kartenclustering wird keine zusätzliche Bibliothek evaluiert oder integriert, solange die native
  Mapbox-Lösung für die tatsächliche Location-Anzahl ausreicht.
- Neue kartenbezogene Funktionen (z. B. weitere Marker-Typen, Filter) müssen die definierten Performance-
  Ziele (60 fps bei Kartenbewegungen, blockierfreie Realtime-Updates) einhalten.
- Performance-Regressionen auf der Karte sind während der Entwicklung aktiv zu überwachen (Sentry
  Performance Monitoring, React-Native-Performance-Profiler), nicht erst bei Nutzerbeschwerden zu
  untersuchen.
- Live-Auslastungsanzeigen auf der Karte folgen demselben Realtime-Architekturmuster wie alle anderen
  zeitkritischen Daten (siehe ADR-003) — keine kartenspezifische Sonderlösung.

## Betrachtete Alternativen

- **Zusätzliche Clustering-Bibliothek statt nativem Mapbox-Clustering:** verworfen, da für die
  überschaubare Location-Anzahl an der Playa de Palma kein Mehrwert gegenüber der nativen Lösung
  erkennbar ist und zusätzliche Abhängigkeiten vermieden werden (siehe `CLAUDE.md`: keine neue
  Abhängigkeit ohne triftigen Grund).
- **Anderer Kartendienst (z. B. Google Maps, Apple Maps, OpenStreetMap-basierte Lösungen):** nicht
  Gegenstand dieser ADR — Mapbox war bereits als Teil des Tech-Stacks in `PROJECT.md` festgelegt.
- **Eigenes Polling für Live-Auslastung auf der Karte statt Realtime Service:** verworfen zugunsten des
  einheitlichen, in ADR-003 festgelegten Realtime-Architekturmusters.
- Weitere Details und die vollständige Abwägung sind in `docs/Architecture.md` Kapitel 16 dokumentiert.

## Referenzen

- `PROJECT.md` → Tech-Stack (Mapbox als Kartendienst)
- `docs/PRD.md` Kapitel 10 „Screenübersicht" (Map Screen), Kapitel 15/17/20 (Performance, Risiken)
- `docs/Architecture.md` Kapitel 16 „Performance" (inkl. Performance-Ziele & Kartenclustering,
  Architekturentscheidung 10)
- `docs/Architecture.md` Kapitel 11 „Realtime-Architektur" (Live-Auslastungsdaten, ADR-003)
- `docs/Architecture.md` Kapitel 18 „Logging" (Sentry Performance Monitoring)
- `docs/DesignSystem.md` — visuelle Gestaltung der Karte (Marker, Cluster-Darstellung), keine
  Performance-Vorgaben
- `docs/Database.md` 2.3 „Locations" (Geokoordinaten-Feld)
- `docs/API.md` Kapitel 3 „Locations" (Abfrage nach Nähe/Geokoordinaten)
