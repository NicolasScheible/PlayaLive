import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { FavoriteService } from '../../../services/FavoriteService';
import type { Favorite } from '../../../types/entities';

// Anzahl Favoriten gemäß Auftrag Punkt 1 — über den bereits bestehenden
// `FavoriteService.getFavorites()` ohne Typ-Filter (liefert laut docs/API.md Kapitel 7 alle Favoriten
// des Nutzers). Eigener Query-Key, da weder `['favorites','location']` noch `['favorites','event']`/
// `['favorites','artist']` (jeweils typgefiltert, siehe useLocationFavorite.ts/useFavoriteLocations.ts)
// dieselbe, ungefilterte Abfrage abbilden.
export function useFavoritesCount() {
  const query = useQuery<Favorite[], AppError>({
    queryKey: ['favorites', 'all'],
    queryFn: () => FavoriteService.getFavorites(),
  });

  return {
    count: query.data?.length ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
