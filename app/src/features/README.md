# features/

Feature-basierte Module (siehe `docs/Architecture.md` Kapitel 6). Jede fachliche Domäne aus
`docs/Database.md` bildet ein eigenes Modul mit eigenen Screens, Feature-spezifischen Hooks und
Feature-spezifischer Business-Logik: `auth/`, `locations/`, `events/`, `artists/`, `favorites/`,
`reports/` (Community Reports inkl. Trust Score, Geofencing), `specials/` (Specials & Happy Hours),
`notifications/`, `weather/`.

Ein Feature-Modul greift ausschließlich über seinen eigenen Service (bzw. geteilte Services aus
`src/services/`) auf Daten zu — nie direkt auf ein anderes Feature-Modul oder auf Supabase.
Wiederkehrende UI-Bausteine liegen nicht hier, sondern in `src/components/`.
