import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { FavoriteService } from '../../../services/FavoriteService';
import { useFilterStore } from '../../../store/filterStore';
import type { Favorite, LocationWithLiveStatus } from '../../../types/entities';
import { isOpenNow } from '../../../utils/isOpenNow';

// Wendet ausschließlich die im Auftrag genannten, bereits im `filterStore` definierten Filter an
// (Kategorie, Auslastung, geöffnet, Favoriten) — „Filter ausschließlich über bestehende Stores"
// (kein eigener Filter-Zustand in diesem Hook). Filterung erfolgt clientseitig auf der bereits
// geladenen Location-Liste statt je Filteränderung neu vom Server zu laden (Performance-Vorgabe:
// „keine unnötigen Re-Renders"/Query-Cache).
export function useMapFilters(locations: LocationWithLiveStatus[]) {
  const category = useFilterStore((state) => state.category);
  const occupancyLevel = useFilterStore((state) => state.occupancyLevel);
  const openNow = useFilterStore((state) => state.openNow);
  const favoritesOnly = useFilterStore((state) => state.favoritesOnly);

  const favoritesQuery = useQuery<Favorite[], AppError>({
    queryKey: ['favorites', 'location'],
    queryFn: () => FavoriteService.getFavorites('location'),
    enabled: favoritesOnly,
  });

  const favoriteLocationIds = new Set(
    (favoritesQuery.data ?? []).map((favorite) => favorite.target_id),
  );

  const filteredLocations = locations.filter((location) => {
    if (category && location.category !== category) {
      return false;
    }

    if (occupancyLevel && location.liveStatus?.occupancy_level !== occupancyLevel) {
      return false;
    }

    if (openNow && !isOpenNow(location.opening_hours)) {
      return false;
    }

    if (favoritesOnly && !favoriteLocationIds.has(location.id)) {
      return false;
    }

    return true;
  });

  return {
    filteredLocations,
    isLoading: favoritesOnly && favoritesQuery.isLoading,
    isError: favoritesOnly && favoritesQuery.isError,
    error: favoritesOnly ? (favoritesQuery.error ?? null) : null,
  };
}
