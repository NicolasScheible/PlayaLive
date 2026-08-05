import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { LocationService } from '../../../services/LocationService';
import type { LocationWithLiveStatus } from '../../../types/entities';

// Query-Key exakt nach dem in docs/ADR/001-State-Management.md genannten Beispiel
// `['locations','detail',id]`. `notFound` unterscheidet den (fehlerfreien) Fall „keine Zeile
// gefunden" (`LocationService.getLocationById` liefert dann `null`) vom echten Ladefehler.
export function useLocationDetail(locationId: string) {
  const query = useQuery<LocationWithLiveStatus | null, AppError>({
    queryKey: ['locations', 'detail', locationId],
    queryFn: () => LocationService.getLocationById(locationId),
  });

  return {
    location: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
    notFound: query.isSuccess && query.data === null,
  };
}
