import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ArtistService } from '../../../services/ArtistService';
import type { Artist } from '../../../types/entities';

// Query-Key nach dem in docs/ADR/001-State-Management.md verbindlich festgelegten, domänenbasierten
// Schema (analog zu `['locations','detail',id]`/`['events','detail',id]`). `notFound` unterscheidet
// den (fehlerfreien) Fall „keine Zeile gefunden" (`ArtistService.getArtistById` liefert dann `null`)
// vom echten Ladefehler — exakt wie `useLocationDetail.ts`/`useEventDetail.ts`.
export function useArtistDetail(artistId: string) {
  const query = useQuery<Artist | null, AppError>({
    queryKey: ['artists', 'detail', artistId],
    queryFn: () => ArtistService.getArtistById(artistId),
  });

  return {
    artist: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
    notFound: query.isSuccess && query.data === null,
  };
}
