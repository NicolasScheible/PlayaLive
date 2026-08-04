# store/

Zustand-Stores für globalen Client State (siehe `docs/ADR/001-State-Management.md`). Mehrere
themenbezogene Stores mit klar abgegrenzter Verantwortung statt eines einzelnen globalen Stores —
z. B. `authStore`, `uiStore`, `filterStore`, `mapStore`, `settingsStore`. Ausschließlich globaler
UI-/Client-Zustand, keine dauerhaften Backend-Daten (diese laufen über TanStack Query, siehe
`src/lib/queryClient.ts`).
