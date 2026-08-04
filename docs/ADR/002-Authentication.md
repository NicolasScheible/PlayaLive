# ADR-002: Authentication

## Status

Accepted

## Datum

2026-08-04

## Kontext

PlayaLive-Kernfunktionen (Favoriten, Push-Benachrichtigungen, Community Reports, Bewertungen inkl.
Kommentar, geräteübergreifende Synchronisation) basieren auf Personalisierung und Nutzerinteraktion und
setzen einen eindeutig identifizierten Nutzer voraus. Zugleich muss der Registrierungs-/Login-Prozess so
unkompliziert bleiben, dass er den Einstieg in die App nicht unnötig erschwert.

## Problemstellung

Wie erfolgt die Authentifizierung in PlayaLive Version 1.0 — insbesondere: ist ein Gastzugriff möglich,
welche Login-Methoden werden unterstützt, wie wird die Session verwaltet, und wie werden Passwort-Reset
und E-Mail-Verifizierung gehandhabt?

## Entscheidung

- **Login-Pflicht:** Ab Version 1.0 ist die Anmeldung verpflichtend. Es existiert **kein Gastmodus** —
  jeder Nutzer muss sich vor der Nutzung der App anmelden.
- **Login-Methoden:** Apple Sign-In (iOS), Google Sign-In, E-Mail & Passwort.
- **Umsetzung:** über Supabase Auth, gekapselt im `AuthService` (Service Layer, siehe ADR-005).
- **Rollenzuweisung:** Nach erfolgreicher Anmeldung erhält der Nutzer automatisch Zugriff entsprechend
  seiner serverseitig zugewiesenen Rolle (`user`, `location_manager` [v2.0], `admin`, `super_admin`),
  gespeichert im Feld `role` der Tabelle `profiles` und ausschließlich serverseitig über Row-Level-
  Security durchgesetzt (siehe ADR-004, ADR-008). Das Frontend nutzt die Rolle nur zur bedingten
  UI-Anzeige, nie zur eigenständigen Rechtedurchsetzung.
- **Session-Verwaltung:** automatischer stiller Token-Refresh im Hintergrund; eine Weiterleitung zum
  Login erfolgt ausschließlich bei endgültig ungültigem/abgelaufenem Refresh-Token.
- **Passwort-Reset:** einmaliger 6-stelliger OTP-Code an die registrierte E-Mail-Adresse, direkt in der
  App eingegeben (kein App-Wechsel erforderlich). Der Code hat eine begrenzte Gültigkeit und kann erneut
  angefordert werden.
- **E-Mail-Verifizierung:** Bei Apple/Google Sign-In gilt die Adresse automatisch als verifiziert. Bei
  E-Mail-Registrierung ist die App sofort nach der Registrierung nutzbar (auch unverifiziert) — die
  Verifizierung ist jedoch Voraussetzung, um Community-Inhalte zu veröffentlichen (Community Reports,
  Reviews). Bis zur Bestätigung erinnert die App dezent an die ausstehende Verifizierung.

## Begründung

Nahezu alle Kernfunktionen von PlayaLive setzen eine Nutzeridentität voraus; ein verpflichtender Login
schafft von Beginn an hohe Datenqualität und eine sichere Grundlage für Missbrauchsschutz (Trust Score,
Rate Limiting, Geofencing, Moderation) sowie künftige Partner-/Premium-Funktionen. Ein optionaler
Gastmodus hätte diese Grundlage geschwächt, ohne einen für Version 1.0 relevanten Mehrwert zu bieten. Die
sofortige Nutzbarkeit nach E-Mail-Registrierung (ohne Verifizierungszwang für Lesezugriffe) hält den
Einstieg schnell und unkompliziert, während die Verifizierungspflicht für Community-Inhalte eine weitere,
von Login-Pflicht/Trust Score/Rate Limiting/Geofencing/Moderation unabhängige Missbrauchsschutz-Schicht
ergänzt. Der stille Token-Refresh vermeidet unnötige erneute Logins und damit Nutzerfrustration, ohne die
Sicherheit zu beeinträchtigen.

## Konsequenzen

- Jeder Screen/Flow, der personalisierte oder community-basierte Funktionen anbietet, kann von einem
  angemeldeten, eindeutig identifizierten Nutzer ausgehen — es muss keine Gastmodus-Sonderbehandlung
  implementiert werden.
- Neue Features, die Community-Inhalte veröffentlichen, müssen die E-Mail-Verifizierungsprüfung
  serverseitig einbeziehen (analog zu Community Reports/Reviews).
- Die Rollenprüfung erfolgt ausschließlich serverseitig über RLS; UI-seitige Rollenprüfungen dienen
  ausschließlich der Darstellung und dürfen niemals als alleinige Zugriffskontrolle verwendet werden.
- Der `AuthService` ist die einzige Stelle im Frontend, die mit Supabase Auth kommuniziert.

## Betrachtete Alternativen

- **Optionaler Gastmodus mit eingeschränktem Funktionsumfang:** verworfen, da Kernfunktionen ohnehin
  Personalisierung erfordern und ein Gastmodus zusätzliche Komplexität (zwei parallele Zugriffspfade)
  ohne ausreichenden Mehrwert für Version 1.0 bedeutet hätte.
- **Verpflichtende E-Mail-Verifizierung vor jeglicher App-Nutzung:** verworfen zugunsten sofortiger
  Nutzbarkeit nach Registrierung; die Verifizierungspflicht wurde stattdessen gezielt auf
  Community-Inhalte begrenzt.
- **Passwort-Reset per Link statt OTP-Code:** verworfen zugunsten eines In-App-OTP-Flows ohne
  App-Wechsel.
- Weitere Details und die vollständige Abwägung sind in `docs/Architecture.md` Kapitel 12 dokumentiert.

## Referenzen

- `docs/PRD.md` Kapitel 12 „Rollenmodell & Authentifizierung" (Login-Pflicht, Rollen, Klärung 4/9)
- `docs/Architecture.md` Kapitel 12 „Authentifizierung" (inkl. Passwort-Reset & E-Mail-Verifizierung,
  Architekturentscheidungen 4 und 8)
- `docs/Architecture.md` Kapitel 13 „Rollenmodell"
- `docs/Architecture.md` Kapitel 7 „Navigation" (Session-Verhalten, Login-Flow)
- `docs/Architecture.md` Kapitel 17 „Sicherheit" (RLS-Durchsetzung der Rollen)
- `docs/DesignSystem.md` — keine direkten Design-Vorgaben zur Authentifizierungslogik selbst
- `docs/Database.md` 2.1 „Profiles" (Rollenfeld, Beziehungen)
- `docs/API.md` Kapitel 2 „Authentication"
