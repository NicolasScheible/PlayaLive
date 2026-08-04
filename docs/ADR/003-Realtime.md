# ADR-003: Realtime

## Status

Accepted

## Datum

2026-08-04

## Kontext

PlayaLive lebt vom Live-Charakter der Daten — insbesondere der Community-gemeldeten Auslastung von
Locations. Nicht alle Daten der App sind jedoch gleich zeitkritisch: Stammdaten wie Location-Beschreibungen
oder Künstlerprofile ändern sich selten, während Auslastungsmeldungen, Benachrichtigungen und kurzfristige
Event-/Special-Änderungen in Echtzeit sichtbar sein müssen. Ein pauschaler Realtime-Einsatz auf alle
Tabellen würde unnötigen Netzwerk- und Akkuverbrauch verursachen; ein direkter Realtime-Zugriff aus
Screens/Komponenten würde die in ADR-001 festgelegte Trennung zwischen Server State (TanStack Query) und
UI verletzen.

## Problemstellung

Für welche Daten wird Supabase Realtime eingesetzt, wie ist der Zugriff darauf architektonisch
strukturiert, und wie verhält sich die App bei Verbindungsabbrüchen oder gehäuften Realtime-Events?

## Entscheidung

- **Gezielter Einsatz statt pauschaler Aktivierung:** Realtime ist aktiviert für Reports (Live-
  Auslastung, Wartezeit, Stimmung, Trend, Vertrauensindikator), Notifications, Events (kurzfristige
  Änderungen), Specials & Happy Hours sowie ausschließlich die Live-Daten-Felder von Locations (nicht
  deren Stammdaten).
- **Nicht per Realtime synchronisiert:** Künstlerprofile, Benutzerprofile, Einstellungen, Favoriten,
  Bewertungen (inkl. Kommentar), Medien, historische Daten — diese laufen über TanStack Query mit
  Caching/gezielten Aktualisierungen (siehe ADR-001).
- **Zentraler Realtime Service:** Realtime-Abonnements laufen ausschließlich über einen zentralen
  Realtime Service (Supabase Realtime → Realtime Service → TanStack-Query-Cache → Custom Hooks →
  Components). Screens/Komponenten kommunizieren niemals direkt mit Supabase Realtime.
- **Subscription-Lifecycle:** nur sichtbare Screens abonnieren; nicht sichtbare Screens beenden ihre
  Subscriptions automatisch.
- **Reconnect:** Nutzung des in Supabase Realtime eingebauten automatischen Reconnects ohne eigenen
  Backoff-Algorithmus; zusätzlich prüft die App beim Wechsel vom Hintergrund in den Vordergrund aktiv die
  Verbindung und startet bei Bedarf sofort einen neuen Verbindungsversuch.
- **Verbindungsstatus:** bei vorübergehend fehlender Verbindung erhält der Nutzer einen dezenten,
  automatisch ausgeblendeten Hinweis; die übrige App bleibt vollständig nutzbar.
- **Fallback:** gelingt die Wiederverbindung nach mehreren automatischen Versuchen weiterhin nicht, wird
  einmalig ein Refetch der betroffenen Daten ausgelöst. Kein dauerhaftes Polling in Version 1.0.
- **Debouncing:** ein Zeitfenster von 300 ms bündelt mehrere kurz aufeinanderfolgende Realtime-Events zu
  einer gemeinsamen Verarbeitung.

## Begründung

Der gezielte statt pauschale Realtime-Einsatz reduziert Netzwerk- und Akkuverbrauch, ohne den Live-
Charakter der tatsächlich zeitkritischen Daten zu beeinträchtigen — Stammdaten profitieren nicht spürbar
von Echtzeit-Synchronisation und werden ausreichend performant über TanStack Query aktualisiert. Ein
zentraler Realtime Service verhindert verstreute, inkonsistente Subscription-Logik in einzelnen
Komponenten und hält Realtime konsequent in derselben Datenzugriffsschicht wie alle anderen Daten (siehe
CLAUDE.md: „Live-/Realtime-Datenflüsse werden über dieselbe Datenzugriffsschicht wie alle anderen Daten
geführt"). Der eingebaute Supabase-Reconnect vermeidet unnötige Eigenentwicklung, während die aktive
Prüfung beim App-Wiedereinstieg verzögerte Reconnects nach längerer Inaktivität abfängt. Das dezente
Hinweis-Konzept statt harter Fehlerzustände hält die App bei kurzen Verbindungsstörungen durchgehend
nutzbar. Debouncing verhindert, dass gehäufte Events (z. B. mehrere Reports kurz hintereinander) zu
unnötig vielen UI-Neuzeichnungen führen.

## Konsequenzen

- Neue zeitkritische Datentypen müssen explizit als Realtime-Kandidat bewertet werden — Realtime wird
  nicht automatisch für neue Tabellen aktiviert.
- Jeder Realtime-Zugriff läuft über den zentralen Realtime Service; ein direkter Supabase-Realtime-
  Aufruf aus einer Komponente ist architektonisch nicht vorgesehen.
- Bildschirme müssen ihre Subscriptions beim Verlassen/Unsichtbarwerden zuverlässig beenden, um die
  Performance-Regel „nur sichtbare Screens abonnieren" einzuhalten.
- Es ist kein dauerhafter Polling-Mechanismus als Realtime-Ersatz zu implementieren; bei anhaltenden
  Verbindungsproblemen genügt ein einmaliger Refetch.

## Betrachtete Alternativen

- **Realtime pauschal für alle Tabellen:** verworfen wegen unnötigen Netzwerk-/Akkuverbrauchs und
  fehlendem Mehrwert für selten wechselnde Stammdaten.
- **Direkter Realtime-Zugriff aus Screens/Komponenten:** verworfen zugunsten eines zentralen Realtime
  Service, um die Datenzugriffsschicht konsistent zu halten (siehe ADR-001, ADR-005).
- **Dauerhaftes Polling statt/zusätzlich zu Realtime:** verworfen für Version 1.0 wegen unnötigen
  Netzwerkverkehrs; stattdessen einmaliger Refetch als Fallback nach gescheitertem Reconnect.
- **Eigener Backoff-Algorithmus für Reconnects:** verworfen zugunsten des eingebauten Supabase-
  Reconnect-Mechanismus, ergänzt um eine aktive Verbindungsprüfung beim App-Wiedereinstieg.
- Weitere Details und die vollständige Abwägung sind in `docs/Architecture.md` Kapitel 11 dokumentiert.

## Referenzen

- `docs/PRD.md` Kapitel 15 „Realtime-Kanäle" (Klärung 14/15)
- `docs/Architecture.md` Kapitel 11 „Realtime-Architektur" (inkl. Reconnect/Verbindungsstatus/Fallback/
  Debouncing, Architekturentscheidung 7)
- `docs/Architecture.md` Kapitel 10 „State Management" (Zusammenspiel mit TanStack-Query-Cache, ADR-001)
- `docs/Architecture.md` Kapitel 23.2 „Realtime-Datenfluss" (Diagramm)
- `docs/DesignSystem.md` — keine direkten Design-Vorgaben zur Realtime-Architektur selbst
- `docs/Database.md` Kapitel 6 „Realtime-Kanäle"
- `docs/API.md` Kapitel 12 „Realtime-Subscriptions"
