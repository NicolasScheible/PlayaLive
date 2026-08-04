import { useUserLocation } from '../../../hooks/useUserLocation';
import { useMapStore } from '../../../store/mapStore';

import { useLocationMarkers } from './useLocationMarkers';
import { useMapFilters } from './useMapFilters';
import { useMapLocations } from './useMapLocations';
import { useSelectedLocationDetail } from './useSelectedLocationDetail';

// Einziger Hook, den `MapScreen.tsx` aufruft (analog zu `useHomeDashboard.ts` im Home-Dashboard) —
// bündelt Standort, Location-/Live-Status-Daten, Filter, Marker-GeoJSON und Bottom-Sheet-Inhalt.
export function useMapScreen() {
  const userLocation = useUserLocation();
  const locationsQuery = useMapLocations();
  const {
    filteredLocations,
    isLoading: isFiltersLoading,
    isError: isFiltersError,
    error: filtersError,
  } = useMapFilters(locationsQuery.locations);

  const selectedLocationId = useMapStore((state) => state.selectedLocationId);
  const selectLocation = useMapStore((state) => state.selectLocation);
  const clearSelection = useMapStore((state) => state.clearSelection);

  const markers = useLocationMarkers(filteredLocations, selectedLocationId);
  const selectedLocation = useSelectedLocationDetail(
    selectedLocationId,
    locationsQuery.locations,
    userLocation.coords,
  );

  return {
    userLocation,
    filteredLocations,
    markers,
    selectedLocationId,
    selectLocation,
    clearSelection,
    selectedLocation,
    isLoading: locationsQuery.isLoading || isFiltersLoading,
    isError: locationsQuery.isError || isFiltersError,
    error: locationsQuery.error ?? filtersError,
  };
}
