import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { FavoriteService } from '../../../services/FavoriteService';
import type { Favorite } from '../../../types/entities';

// Analog zu `useLocationFavorite.ts` im Location-Detail-Feature, hier für `target_type: 'event'`.
// Query-Key `['favorites','event']` folgt demselben, dort bereits etablierten Muster
// (`['favorites','location']`) — keine neue Architekturentscheidung.
export function useEventFavorite(eventId: string) {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery<Favorite[], AppError>({
    queryKey: ['favorites', 'event'],
    queryFn: () => FavoriteService.getFavorites('event'),
  });

  const isFavorited = (favoritesQuery.data ?? []).some(
    (favorite) => favorite.target_id === eventId,
  );

  const toggleMutation = useMutation<boolean, AppError>({
    mutationFn: () => FavoriteService.toggleFavorite('event', eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'event'] });
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
