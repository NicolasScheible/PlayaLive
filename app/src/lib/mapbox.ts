import Mapbox from '@rnmapbox/maps';

// Kartendienst Mapbox mit nativem Clustering (siehe docs/ADR/006-Maps.md).
const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

if (!mapboxAccessToken) {
  throw new Error('EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN muss gesetzt sein (siehe .env.example).');
}

Mapbox.setAccessToken(mapboxAccessToken);
