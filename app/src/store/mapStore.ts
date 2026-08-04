import { create } from 'zustand';

// Globaler Client State für den Kartenstatus (siehe docs/ADR/001-State-Management.md: „mapStore" als
// benanntes Beispiel für einen themenbezogenen Store). Ausschließlich UI-Zustand — welche Location auf
// der Karte aktuell ausgewählt ist (Bottom Sheet geöffnet/geschlossen) —, keine Backend-Daten (siehe
// CLAUDE.md → Architekturregeln: „Live-/Realtime-Datenflüsse ... über dieselbe Datenzugriffsschicht").
type MapState = {
  selectedLocationId: string | null;
};

type MapActions = {
  selectLocation: (locationId: string) => void;
  clearSelection: () => void;
};

export const useMapStore = create<MapState & MapActions>((set) => ({
  selectedLocationId: null,

  selectLocation: (locationId) => set({ selectedLocationId: locationId }),
  clearSelection: () => set({ selectedLocationId: null }),
}));
