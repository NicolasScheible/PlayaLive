import { LocationService } from '../../../services/LocationService';
import type { Location } from '../../../types/entities';

import { useFavoriteList } from './useFavoriteList';

// Nutzt denselben Query-Key `['locations', 'list', {}]` wie `useMapLocations.ts`/`useArtistEvents.ts` —
// Cache-Wiederverwendung, kein doppelter Request beim Wechsel zwischen Karte/Artist Detail und dem
// Favoriten-Locations-Tab.
export function useFavoriteLocations(enabled: boolean) {
  return useFavoriteList<Location>({
    targetType: 'location',
    entityQueryKey: ['locations', 'list', {}],
    fetchEntities: () => LocationService.getLocations(),
    getId: (location) => location.id,
    enabled,
  });
}
