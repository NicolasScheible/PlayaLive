import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { FavoriteService } from '../../../services/FavoriteService';
import type { Favorite } from '../../../types/entities';

// Gleicher Query-Key wie im Live-Map-Feature (`useMapFilters.ts`) — dieselbe Favoriten-Liste, dadurch
// Cache-Wiederverwendung zwischen Karte und Location Detail. Toggle über `useMutation`
// (docs/ADR/001-State-Management.md nennt „Optimistic Updates" als vorgesehene TanStack-Query-
// Fähigkeit — hier ohne optimistisches Update umgesetzt: einfache Invalidierung nach Erfolg genügt für
// einen einzelnen Toggle-Button, siehe CLAUDE.md „keine vorzeitigen Abstraktionen").
export function useLocationFavorite(locationId: string) {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery<Favorite[], AppError>({
    queryKey: ['favorites', 'location'],
    queryFn: () => FavoriteService.getFavorites('location'),
  });

  const isFavorited = (favoritesQuery.data ?? []).some(
    (favorite) => favorite.target_id === locationId,
  );

  const toggleMutation = useMutation<boolean, AppError>({
    mutationFn: () => FavoriteService.toggleFavorite('location', locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'location'] });
    },
  });

  return {
    isFavorited,
    toggleFavorite: () => toggleMutation.mutate(),
    isLoading: favoritesQuery.isLoading,
    isToggling: toggleMutation.isPending,
    error: favoritesQuery.error ?? toggleMutation.error ?? null,
  };
}
