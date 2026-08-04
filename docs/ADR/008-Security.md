# ADR-008: Security

## Status

Accepted

## Datum

2026-08-04

## Kontext

PlayaLive verarbeitet personenbezogene Daten (Nutzerprofile, Standortdaten für Geofencing, Trust Score)
sowie community-generierte Inhalte, die missbrauchsanfällig sind (Falschmeldungen zur Auslastung,
missbräuchliche Bewertungen). Zugriffsrechte, Secrets und Umgebungstrennung müssen so aufgebaut sein,
dass Sicherheit und Datenschutz von Beginn an integraler Bestandteil der Architektur sind, nicht ein
nachträglicher Schritt — siehe `CLAUDE.md`: „Saubere Architektur bleibt Priorität, auch unter
Zeitdruck."

## Problemstellung

Wie werden Zugriffsrechte auf Datenbankebene durchgesetzt, wie wird Missbrauch bei Community Reports
verhindert, wie werden Secrets und Umgebungen verwaltet, und wie erfüllt PlayaLive DSGVO-Anforderungen
(Standort-Consent, Betroffenenrechte)?

## Entscheidung

- **Login-Pflicht**, kein Gastmodus (siehe ADR-002).
- **Row-Level-Security „Security by Default":** alle Tabellen mit aktivierter RLS, „Deny by Default" —
  jede Berechtigung wird explizit über Policies vergeben. Das Frontend entscheidet nie über
  Berechtigungen, es zeigt die Rolle nur bedingt in der UI an (siehe ADR-002).
- Jede Tabelle besitzt einen Owner/eine eindeutige Berechtigung; jeder Datensatz ist einem Ersteller
  zugeordnet; Änderungen werden mit Zeitstempel gespeichert; kritische Änderungen werden protokolliert
  (Audit Log); Soft Delete statt endgültigem Löschen, sofern sinnvoll (siehe ADR-004); Fremdschlüssel
  sichern alle Beziehungen.
- **API-Endpunkt-Prüfungen:** Authentifizierung, Rolle, Berechtigung, Besitz des Datensatzes,
  Eingabedaten, Rate Limiting sowie — für das Veröffentlichen von Community-Inhalten (Reports, Reviews)
  — der E-Mail-Verifizierungsstatus (siehe ADR-002).
- **Missbrauchsschutz bei Community Reports:** Login-Pflicht, Rate Limiting (max. ein Report pro Nutzer/
  Location je Zeitfenster), Geofencing (100–150 m Radius), Vertrauensscore-Gewichtung,
  Mehrfachbestätigung, Meldefunktion, automatische Missbrauchserkennung — alle Prüfungen serverseitig.
- **Storage:** kein Upload ohne Authentifizierung; Schreibrechte je Bucket rollenbasiert.
- **Secrets-Verwaltung:** ausschließlich über Umgebungsvariablen — lokal `.env.local` (nicht versioniert,
  `.gitignore`), CI/CD und Builds über Expo EAS Secrets (ggf. ergänzt um GitHub Secrets). API-Schlüssel,
  Tokens oder Zugangsdaten dürfen niemals im Quellcode oder Repository landen.
- **Umgebungen:** drei vollständig getrennte Umgebungen — Development, Staging, Production — jede mit
  eigenem Supabase-Projekt, eigener Datenbank, eigenen Storage-Buckets, eigenen Edge Functions und
  eigenen API-Keys/Secrets. Produktionsdaten werden niemals für Entwicklungs-/Testzwecke verwendet.
- **Security-Reviews:** ereignisbasiert statt nach festem Zeitintervall — verpflichtend vor jedem
  App-Store-Release sowie nach Änderungen an Authentifizierung, RLS-Policies, Edge Functions oder
  sonstigen sicherheitsrelevanten Infrastrukturänderungen. Der Product Owner trägt die
  Freigabeverantwortung.
- **Standort-Consent:** keine automatische Standortabfrage beim ersten Start. Die Berechtigung wird erst
  angefragt, wenn eine Funktion sie tatsächlich benötigt (Live-Karte, Community Report, Navigation), mit
  vorangehendem kurzem Hinweis zum Mehrwert. Keine dauerhafte Hintergrund-Ortung.
- **DSGVO-Betroffenenrechte:** in den Einstellungen verfügbar — Konto deaktivieren, Konto dauerhaft
  löschen, eigene Daten als Self-Service exportieren (ausschließlich die personenbezogenen Daten des
  jeweiligen Nutzers). Nach Konto-Löschung werden personenbezogene Daten gemäß den (noch offenen, siehe
  „Konsequenzen") Aufbewahrungs-/Löschrichtlinien entfernt oder anonymisiert, sofern keine gesetzlichen
  Aufbewahrungspflichten entgegenstehen.

## Begründung

„Security by Default" (Deny by Default) stellt sicher, dass eine vergessene oder fehlerhafte Policy zu
einem verweigerten statt einem unbeabsichtigt gewährten Zugriff führt — das sicherere Fehlerverhalten für
eine App mit personenbezogenen und community-generierten Daten. Die serverseitige Durchsetzung aller
Berechtigungen (statt einer Frontend-Prüfung) verhindert, dass ein manipulierter Client Zugriffsrechte
umgehen kann. Die mehrschichtigen Missbrauchsschutz-Mechanismen bei Community Reports (Login, Rate
Limiting, Geofencing, Trust Score, Mehrfachbestätigung, Meldefunktion) adressieren gemeinsam das zentrale
Produktrisiko unzuverlässiger Live-Daten, ohne sich auf eine einzelne Maßnahme zu verlassen. Drei
vollständig getrennte Umgebungen verhindern, dass Entwicklungs-/Testaktivitäten reale Nutzerdaten
gefährden, und Secrets ausschließlich über Umgebungsvariablen/EAS Secrets zu verwalten verhindert, dass
Zugangsdaten versehentlich ins Repository gelangen. Ereignisbasierte statt zeitgesteuerte Security-Reviews
stellen sicher, dass tatsächlich sicherheitsrelevante Änderungen geprüft werden, statt Reviews an
irrelevanten Zeitpunkten pauschal durchzuführen. Der zurückhaltende Standort-Consent-Ansatz (Anfrage erst
bei tatsächlichem Bedarf, mit Erklärung) reduziert unnötige Berechtigungsanfragen und erhöht die
Akzeptanzwahrscheinlichkeit, während er zugleich DSGVO-Grundsätzen der Datenminimierung entspricht.

## Konsequenzen

- Jede neue Tabelle benötigt von Beginn an explizite RLS-Policies; es gibt keinen Zustand, in dem eine
  Tabelle ohne aktivierte RLS produktiv genutzt wird.
- Neue API-Endpunkte müssen alle genannten Prüfungen (Authentifizierung, Rolle, Berechtigung, Besitz,
  Eingabedaten, Rate Limiting) implementieren, bevor sie freigegeben werden.
- Neue sicherheitsrelevante Infrastrukturänderungen (Auth, RLS, Edge Functions) lösen automatisch ein
  Security-Review vor dem nächsten Release aus.
- Standortzugriff darf in keinem neuen Feature ohne unmittelbaren funktionalen Bedarf angefragt werden.
- **Weiterhin offen** (bewusst nicht Teil dieser Entscheidung, siehe `docs/Architecture.md` Kapitel 17
  und Kapitel 25, Punkt 11): konkrete Aufbewahrungs-/Löschfristen je Datentyp nach Konto-Löschung sowie
  das genaue Format des Datenexports — diese sind vor der jeweils betroffenen Implementierung mit dem
  Product Owner zu klären, nicht Gegenstand dieses ADR.

## Betrachtete Alternativen

- **„Allow by Default" mit punktuellen Einschränkungen statt „Deny by Default":** verworfen, da ein
  einzelner vergessener Einschränkungsfall zu unbeabsichtigtem Datenzugriff führen könnte.
- **Frontend-seitige Berechtigungsprüfung als alleinige oder primäre Kontrolle:** verworfen, da ein
  manipulierter Client jede clientseitige Prüfung umgehen kann.
- **Gemeinsame Umgebung für Entwicklung/Test und Produktion:** verworfen wegen des Risikos, reale
  Nutzerdaten durch Entwicklungs-/Testaktivitäten zu gefährden.
- **Zeitgesteuerte statt ereignisbasierte Security-Reviews:** verworfen zugunsten von Reviews, die
  gezielt an tatsächlich sicherheitsrelevante Änderungen gekoppelt sind.
- **Automatische Standortabfrage beim App-Start:** verworfen zugunsten einer bedarfsgesteuerten Abfrage
  mit vorangehender Erklärung.
- Weitere Details und die vollständige Abwägung sind in `docs/Architecture.md` Kapitel 17 dokumentiert.

## Referenzen

- `docs/PRD.md` Kapitel 12 „Rollenmodell & Authentifizierung", Kapitel 15 „Technische Architektur"
  (Row-Level-Security, Missbrauchsschutz, Storage-Buckets), Kapitel 20 „Risiken" (DSGVO)
- `docs/Architecture.md` Kapitel 17 „Sicherheit" (inkl. Secrets/Umgebungen/Security-Reviews/Standort-
  Consent/DSGVO-Rechte, Architekturentscheidung 11)
- `docs/Architecture.md` Kapitel 25, Punkt 11 (offene Detailfrage: Aufbewahrungs-/Löschfristen,
  Datenexport-Format — nicht Teil dieser Entscheidung)
- `docs/DesignSystem.md` — Darstellung der DSGVO-Betroffenenrechte in den Einstellungen
- `docs/Database.md` Kapitel 4 „Row-Level-Security (RLS)"
- `docs/API.md` Kapitel 14 „Rate Limiting & Sicherheit"
