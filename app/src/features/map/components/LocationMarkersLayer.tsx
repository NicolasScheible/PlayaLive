import Mapbox from '@rnmapbox/maps';
import { useMemo } from 'react';

import { theme } from '../../../theme/theme';
import type { LocationMarkersCollection } from '../hooks/useLocationMarkers';

// Marker-Darstellung ausschließlich über natives Mapbox-Clustering (ShapeSource + Circle-/SymbolLayer,
// siehe docs/ADR/006-Maps.md — keine zusätzliche Bibliothek, `PointAnnotation`/`MarkerView`
// unterstützen kein Clustering). Cluster-Kreise in der Markenfarbe, einzelne Location-Marker in der
// Auslastungsfarbe (Kapitel 3: „Kartenpins") mit weißem Ring bei Auswahl. „Logo bzw. Icon" wird aus dem
// tatsächlichen Location-Bild registriert (`useLocationMarkers`) statt einer erfundenen Icon-Bibliothek.
const CLUSTER_RADIUS = 40;
const CLUSTER_MAX_ZOOM_LEVEL = 14;

type LocationMarkersLayerProps = {
  markers: LocationMarkersCollection;
  onPressLocation: (locationId: string) => void;
};

export function LocationMarkersLayer({ markers, onPressLocation }: LocationMarkersLayerProps) {
  const images = useMemo(() => {
    const entries: Record<string, { uri: string }> = {};

    markers.features.forEach((feature) => {
      if (feature.properties.imageUrl) {
        entries[feature.properties.id] = { uri: feature.properties.imageUrl };
      }
    });

    return entries;
  }, [markers]);

  function handlePress(event: { features: GeoJSON.Feature[] }) {
    const properties = event.features[0]?.properties;

    if (properties && !properties.point_count && typeof properties.id === 'string') {
      onPressLocation(properties.id);
    }
  }

  return (
    <>
      <Mapbox.Images images={images} />
      <Mapbox.ShapeSource
        id="location-markers"
        shape={markers}
        cluster
        clusterRadius={CLUSTER_RADIUS}
        clusterMaxZoomLevel={CLUSTER_MAX_ZOOM_LEVEL}
        onPress={handlePress}
      >
        <Mapbox.CircleLayer
          id="location-clusters"
          filter={['has', 'point_count']}
          style={{
            circleColor: theme.colors.brand.primary,
            circleRadius: 18,
            circleStrokeWidth: 2,
            circleStrokeColor: theme.colors.text.primary,
          }}
        />
        <Mapbox.SymbolLayer
          id="location-cluster-count"
          filter={['has', 'point_count']}
          style={{
            textField: ['get', 'point_count_abbreviated'],
            textColor: theme.colors.text.primary,
            textSize: 12,
            textAllowOverlap: true,
          }}
        />
        <Mapbox.CircleLayer
          id="location-points"
          filter={['!', ['has', 'point_count']]}
          style={{
            circleColor: ['get', 'occupancyColor'],
            circleRadius: ['case', ['get', 'isSelected'], 14, 10],
            circleStrokeWidth: 2,
            circleStrokeColor: theme.colors.text.primary,
          }}
        />
        <Mapbox.SymbolLayer
          id="location-icons"
          filter={['!', ['has', 'point_count']]}
          style={{
            iconImage: ['get', 'id'],
            iconSize: 0.5,
            iconAllowOverlap: true,
          }}
        />
      </Mapbox.ShapeSource>
    </>
  );
}
