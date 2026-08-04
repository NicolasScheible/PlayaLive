import { renderHook } from '@testing-library/react-native';

import { theme } from '../../../theme/theme';
import type { LocationWithLiveStatus } from '../../../types/entities';

import { useLocationMarkers } from './useLocationMarkers';

const baseLocation: LocationWithLiveStatus = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club',
  address: null,
  latitude: 39.5,
  longitude: 2.6,
  opening_hours: null,
  images: ['https://example.com/logo.png'],
  is_sponsored: false,
  sponsored_until: null,
  owner_user_id: null,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  liveStatus: {
    location_id: 'loc-1',
    occupancy_level: 'high',
    report_count: 1,
    is_confident: true,
    wait_time_minutes: null,
    last_reported_at: null,
  },
};

describe('useLocationMarkers', () => {
  it('baut eine GeoJSON-FeatureCollection mit Position, Auslastungsfarbe und Logo', () => {
    const { result } = renderHook(() => useLocationMarkers([baseLocation], null));

    expect(result.current).toEqual({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'loc-1',
          geometry: { type: 'Point', coordinates: [2.6, 39.5] },
          properties: {
            id: 'loc-1',
            name: 'Test Club',
            category: 'club',
            occupancyLevel: 'high',
            occupancyColor: theme.colors.status.high,
            imageUrl: 'https://example.com/logo.png',
            isSelected: false,
          },
        },
      ],
    });
  });

  it('markiert die ausgewählte Location', () => {
    const { result } = renderHook(() => useLocationMarkers([baseLocation], 'loc-1'));

    expect(result.current.features[0]?.properties.isSelected).toBe(true);
  });

  it('nutzt eine neutrale Farbe und kein Logo ohne Live-Status/Bilder', () => {
    const locationWithoutData: LocationWithLiveStatus = {
      ...baseLocation,
      images: [],
      liveStatus: null,
    };

    const { result } = renderHook(() => useLocationMarkers([locationWithoutData], null));

    expect(result.current.features[0]?.properties.occupancyLevel).toBeNull();
    expect(result.current.features[0]?.properties.occupancyColor).toBe(theme.colors.text.secondary);
    expect(result.current.features[0]?.properties.imageUrl).toBeNull();
  });
});
