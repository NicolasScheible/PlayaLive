import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { FavoriteService } from '../../../services/FavoriteService';
import type { Favorite } from '../../../types/entities';

// Analog zu `useEventFavorite.ts`/`useLocationFavorite.ts`, hier für `target_type: 'artist'`.
// Query-Key `['favorites','artist']` folgt demselben, bereits etablierten Muster
// (`['favorites','location']`, `['favorites','event']`) — keine neue Architekturentscheidung.
export function useArtistFavorite(artistId: string) {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery<Favorite[], AppError>({
    queryKey: ['favorites', 'artist'],
    queryFn: () => FavoriteService.getFavorites('artist'),
  });

  const isFavorited = (favoritesQuery.data ?? []).some(
    (favorite) => favorite.target_id === artistId,
  );

  const toggleMutation = useMutation<boolean, AppError>({
    mutationFn: () => FavoriteService.toggleFavorite('artist', artistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'artist'] });
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
