# components/

Geteilte, wiederverwendbare UI-Bausteine (z. B. `LocationCard`, `AuslastungsBadge`, `ArtistCard`,
`EventCard`, `FavoriteButton`) — siehe `docs/Architecture.md` Kapitel 5/6/22 und `CLAUDE.md` →
Komponenten-Regeln. Wiederkehrende UI-Elemente werden hier als generische, parametrisierte
Komponenten gebaut, nicht pro Feature/Screen dupliziert. Reine Präsentationslogik, keine
Geschäftslogik und kein Datenzugriff.
