import { create } from 'zustand';

import type { LocationCategory, OccupancyLevel } from '../types/entities';

// Globaler Client State für aktive Filter (siehe docs/ADR/001-State-Management.md: „aktive Filter" als
// benanntes Beispiel für Zustand-Inhalte, „filterStore" als benannter Beispiel-Store). Umfasst
// ausschließlich die bereits definierten Live-Map-Filter (Kategorie, Auslastung, geöffnet, Favoriten) —
// keine weiteren, nicht beauftragten Filter.
type FilterState = {
  category: LocationCategory | null;
  occupancyLevel: OccupancyLevel | null;
  openNow: boolean;
  favoritesOnly: boolean;
};

type FilterActions = {
  setCategory: (category: LocationCategory | null) => void;
  setOccupancyLevel: (occupancyLevel: OccupancyLevel | null) => void;
  setOpenNow: (openNow: boolean) => void;
  setFavoritesOnly: (favoritesOnly: boolean) => void;
  reset: () => void;
};

const initialState: FilterState = {
  category: null,
  occupancyLevel: null,
  openNow: false,
  favoritesOnly: false,
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,

  setCategory: (category) => set({ category }),
  setOccupancyLevel: (occupancyLevel) => set({ occupancyLevel }),
  setOpenNow: (openNow) => set({ openNow }),
  setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly }),
  reset: () => set(initialState),
}));
