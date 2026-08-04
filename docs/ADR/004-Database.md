# ADR-004: Database

## Status

Accepted

## Datum

2026-08-04

## Kontext

PlayaLive benötigt ein Datenbanksystem, das eine relationale Datenstruktur (Locations, Events, Künstler,
Reports, Reviews, Favoriten u. a.), serverseitig durchgesetzte Zugriffsrechte, Echtzeitfähigkeit und
Datei-Speicherung (Bilder) aus einer Hand unterstützt, ohne für Version 1.0 eine eigene Backend-
Infrastruktur betreiben zu müssen.

## Problemstellung

Welches Datenbank-/Backend-System wird für PlayaLive verwendet, wie ist das Datenmodell strukturiert
(insbesondere bei mehrdeutigen Beziehungen wie Favoriten oder Bewertungen über mehrere Zieltypen), und
wie werden Schemaänderungen verwaltet?

## Entscheidung

- **Backend/Datenbank:** Supabase (Postgres, Auth, Realtime, Storage, Edge Functions) als einheitliche
  Backend-Plattform für PlayaLive.
- **Datenmodell:** fachlich beschrieben in `docs/Database.md` — u. a. Profiles, Trust Score Events,
  Locations, Artists, Events, Event Artists, Specials, Happy Hours, Favorites, Reports, Report Flags,
  Reviews, Review Flags, Notifications sowie (ab v2.x) Partners.
- **Polymorphe Tabellen statt getrennter Tabellen je Zieltyp:** Favorites (`target_type`: `location` /
  `artist` / `event`) und Reviews (`target_type`: `location` / `artist`) werden jeweils als eine zentrale
  Tabelle mit serverseitig geprüfter, typabhängiger Referenz modelliert statt als mehrere separate
  Tabellen pro Zieltyp.
- **Soft Delete** für Locations, Artists, Events und Reviews (Feld „gelöscht am" statt physischem
  Löschen).
- **Migrationen:** sämtliche Schemaänderungen ausschließlich über versionierte Supabase-CLI-Migrationen,
  verwaltet im Git-Repository unter `supabase/migrations/`, niemals direkt über das Supabase-Dashboard.
- **Storage:** ein Storage-Bucket pro Entitätstyp (`locations`, `artists`, `events`, `profiles`,
  `specials`, `system`) mit eigenen Policies.
- **Realtime-Kanäle:** siehe ADR-003 (gezielter Realtime-Einsatz für zeitkritische Daten).
- **Zugriffskontrolle:** siehe ADR-008 (Row-Level-Security, „Security by Default").
- **Datenzugriff aus der App:** ausschließlich über den Service Layer, teils ergänzt um eine Repository-
  Schicht — siehe ADR-005.

## Begründung

Supabase vereint Postgres, Auth, Realtime, Storage und Edge Functions in einer Plattform und deckt damit
den gesamten Backend-Bedarf von PlayaLive ab, ohne mehrere separate Dienste integrieren und betreiben zu
müssen — passend zu einem MVP-Umfang ohne dediziertes Backend-Team. Die polymorphe Modellierung von
Favorites und Reviews vermeidet redundante, nahezu identische Tabellen pro Zieltyp (z. B. separate
`location_favorites`/`artist_favorites`/`event_favorites`) und hält die Anwendungslogik (Hinzufügen/
Entfernen/Abrufen von Favoriten bzw. Bewertungen) an einer zentralen Stelle, auf Kosten einer serverseitig
zu prüfenden statt klassischen Fremdschlüssel-Integrität. Versionierte CLI-Migrationen statt manueller
Dashboard-Änderungen stellen sicher, dass jede Schemaänderung nachvollziehbar, reproduzierbar und über
alle Umgebungen (Development/Staging/Production, siehe ADR-008) hinweg konsistent ausgerollt wird. Ein
Bucket pro Entitätstyp erlaubt granulare, auf den jeweiligen Inhaltstyp zugeschnittene Storage-Policies.

## Konsequenzen

- Neue "gehört-zu-mehreren-Zieltypen"-Beziehungen (analog zu Favoriten/Bewertungen) sollten ebenfalls als
  polymorphe Tabelle mit serverseitiger Typ-/Referenzprüfung modelliert werden, statt das Muster pro
  Feature neu zu entscheiden.
- Jede Schemaänderung erfordert eine neue Migration unter `supabase/migrations/`; direkte Änderungen im
  Supabase-Dashboard sind nicht vorgesehen.
- Löschvorgänge für Locations, Artists, Events und Reviews sind als Soft Delete zu implementieren, nicht
  als physisches `DELETE`.
- Neue Datei-/Bildtypen ordnen sich einem bestehenden oder — bei neuem Entitätstyp — einem neuen Storage-
  Bucket mit eigener Policy zu.
- Konkrete Indizes sind bei der jeweiligen Migrationserstellung auf Basis des in `docs/Database.md`
  beschriebenen Datenmodells festzulegen (siehe `docs/PRD.md` Kapitel 22 „Offene Punkte" — kein Teil
  dieser Entscheidung).

## Betrachtete Alternativen

- **Separates Backend (z. B. eigener Node/Express-Server mit eigener Postgres-Instanz):** verworfen, da
  Supabase Auth, Realtime, Storage und Datenbank bereits integriert bereitstellt und für den Umfang eines
  MVP ohne dediziertes Backend-Team ausreicht.
- **Getrennte Tabellen je Zieltyp für Favoriten/Bewertungen** (z. B. `location_favorites`,
  `artist_favorites`, `event_favorites`): verworfen zugunsten einer zentralen polymorphen Tabelle, um
  Redundanz und Logik-Duplizierung zu vermeiden.
- **Physisches Löschen statt Soft Delete:** verworfen, da historische Bezüge (z. B. vergangene Events,
  referenzierte Bewertungen) sonst verloren gingen.
- **Schemaänderungen direkt über das Supabase-Dashboard:** verworfen zugunsten versionierter,
  nachvollziehbarer CLI-Migrationen im Repository.
- Weitere Details und die vollständige Abwägung sind in `docs/Database.md` sowie `docs/PRD.md` Kapitel
  15–16 dokumentiert.

## Referenzen

- `docs/PRD.md` Kapitel 15 „Technische Architektur", Kapitel 16 „Datenmodell (fachlich)"
- `docs/Architecture.md` Kapitel 4 „Projektstruktur" (Verortung `supabase/`)
- `docs/Architecture.md` Kapitel 9 „Repository Pattern" (Datenzugriff, Architekturentscheidung 5)
- `docs/Architecture.md` Kapitel 17 „Sicherheit" (RLS-Grundprinzip, Details siehe ADR-008)
- `docs/DesignSystem.md` — keine direkten Design-Vorgaben zum Datenmodell
- `docs/Database.md` (vollständiges fachliches Datenmodell, Kapitel 1–8)
- `docs/API.md` Kapitel 3–11 (Operationen je Entität, basierend auf diesem Datenmodell)
