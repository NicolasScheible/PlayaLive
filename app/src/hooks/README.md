# hooks/

Geteilte, feature-übergreifende Custom Hooks (siehe `docs/Architecture.md` Kapitel 5). Feature-
spezifische Hooks liegen stattdessen im jeweiligen Modul unter `features/<feature>/`. Hooks kapseln
die Kommunikation zwischen UI und Service Layer / State-Management — Komponenten greifen nie direkt
auf Services oder Stores zu.
