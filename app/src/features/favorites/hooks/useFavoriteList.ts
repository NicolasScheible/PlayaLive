import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { FavoriteService } from '../../../services/FavoriteService';
import type { Favorite, FavoriteTargetType } from '../../../types/entities';

// Gemeinsame Lade-/Entfern-Logik für alle drei Favoriten-Tabs (Locations/Events/Artists) — ab der 3.
// gleichzeitig benötigten Verwendung innerhalb dieses Features als generischer Hook extrahiert
// (CLAUDE.md „ab der 3. Verwendung"), über `useFavoriteLocations`/`useFavoriteEvents`/
// `useFavoriteArtists` jeweils dünn typisiert. Nutzt denselben Query-Key (`['favorites', type]`) wie
// die bestehenden `useLocationFavorite`/`useEventFavorite`/`useArtistFavorite`-Hooks der jeweiligen
// Detail-Screens — Cache wird geteilt, kein doppelter Request beim Wechsel zwischen Favoriten-Liste und
// Detail-Screen. „Entfernen" nutzt denselben `FavoriteService.toggleFavorite` wie das Favoriten-Herz auf
// den Detail-Screens (ein bereits favorisierter Eintrag wird dadurch immer entfernt) — mit optimistischem
// Update (Auftrag Punkt 5: ein Listeneintrag soll beim Entfernen sofort verschwinden), anders als die
// einfache Invalidierung der bestehenden Detail-Screen-Hooks (dort genügt sie für einen einzelnen
// Toggle-Button, siehe deren jeweilige Kommentare).
type UseFavoriteListOptions<T> = {
  targetType: FavoriteTargetType;
  entityQueryKey: readonly unknown[];
  fetchEntities: () => Promise<T[]>;
  getId: (entity: T) => string;
  enabled: boolean;
};

type RemoveContext = {
  previousFavorites: Favorite[] | undefined;
};

export function useFavoriteList<T>({
  targetType,
  entityQueryKey,
  fetchEntities,
  getId,
  enabled,
}: UseFavoriteListOptions<T>) {
  const queryClient = useQueryClient();
  const favoritesQueryKey = ['favorites', targetType];

  const favoritesQuery = useQuery<Favorite[], AppError>({
    queryKey: favoritesQueryKey,
    queryFn: () => FavoriteService.getFavorites(targetType),
    enabled,
  });

  const entitiesQuery = useQuery<T[], AppError>({
    queryKey: entityQueryKey,
    queryFn: fetchEntities,
    enabled,
  });

  const entityById = new Map((entitiesQuery.data ?? []).map((entity) => [getId(entity), entity]));
  const items = (favoritesQuery.data ?? [])
    .map((favorite) => entityById.get(favorite.target_id))
    .filter((entity): entity is T => entity !== undefined);

  const removeMutation = useMutation<boolean, AppError, string, RemoveContext>({
    mutationFn: (targetId) => FavoriteService.toggleFavorite(targetType, targetId),
    onMutate: async (targetId) => {
      await queryClient.cancelQueries({ queryKey: favoritesQueryKey });
      const previousFavorites = queryClient.getQueryData<Favorite[]>(favoritesQueryKey);

      queryClient.setQueryData<Favorite[]>(favoritesQueryKey, (current) =>
        (current ?? []).filter((favorite) => favorite.target_id !== targetId),
      );

      return { previousFavorites };
    },
    onError: (_error, _targetId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoritesQueryKey, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoritesQueryKey });
    },
  });

  return {
    items,
    isLoading: favoritesQuery.isLoading || entitiesQuery.isLoading,
    isError: favoritesQuery.isError || entitiesQuery.isError,
    error: favoritesQuery.error ?? entitiesQuery.error ?? null,
    remove: (targetId: string) => removeMutation.mutate(targetId),
  };
}
