import { useMemo } from 'react';

import { theme } from '../../../theme/theme';
import type {
  LocationCategory,
  LocationWithLiveStatus,
  OccupancyLevel,
} from '../../../types/entities';

// Baut die GeoJSON-FeatureCollection für das native Mapbox-Clustering (ShapeSource + CircleLayer/
// SymbolLayer, siehe docs/ADR/006-Maps.md — `PointAnnotation`/`MarkerView` unterstützen kein
// Clustering). Die Ableitung der Auslastungsfarbe folgt exakt der bereits in `OccupancyBadge.tsx`
// verwendeten Logik (kein neuer Statuswert, „keine Hardcodes"). „Logo bzw. Icon" wird aus dem
// tatsächlichen Location-Bild (`images[0]`) abgeleitet statt einer erfundenen Kategorie-Icon-Bibliothek
// (docs/DesignSystem.md Kapitel 10 markiert die Icon-Quelle als offene Designentscheidung).
export type LocationMarkerProperties = {
  id: string;
  name: string;
  category: LocationCategory;
  occupancyLevel: OccupancyLevel | null;
  occupancyColor: string;
  imageUrl: string | null;
  isSelected: boolean;
};

export type LocationMarkersCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  LocationMarkerProperties
>;

export function useLocationMarkers(
  locations: LocationWithLiveStatus[],
  selectedLocationId: string | null,
): LocationMarkersCollection {
  return useMemo(
    () => ({
      type: 'FeatureCollection',
      features: locations.map((location) => {
        const occupancyLevel = location.liveStatus?.occupancy_level ?? null;

        return {
          type: 'Feature',
          id: location.id,
          geometry: {
            type: 'Point',
            // Location-Query filtert bereits auf `latitude`/`longitude` !== null (useMapLocations).
            coordinates: [location.longitude as number, location.latitude as number],
          },
          properties: {
            id: location.id,
            name: location.name,
            category: location.category,
            occupancyLevel,
            occupancyColor: occupancyLevel
              ? theme.colors.status[occupancyLevel]
              : theme.colors.text.secondary,
            imageUrl: location.images[0] ?? null,
            isSelected: location.id === selectedLocationId,
          },
        };
      }),
    }),
    [locations, selectedLocationId],
  );
}
