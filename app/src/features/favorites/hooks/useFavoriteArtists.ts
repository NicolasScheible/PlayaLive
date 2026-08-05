import { ArtistService } from '../../../services/ArtistService';
import type { Artist } from '../../../types/entities';

import { useFavoriteList } from './useFavoriteList';

export function useFavoriteArtists(enabled: boolean) {
  return useFavoriteList<Artist>({
    targetType: 'artist',
    entityQueryKey: ['artists', 'list', {}],
    fetchEntities: () => ArtistService.getArtists(),
    getId: (artist) => artist.id,
    enabled,
  });
}
