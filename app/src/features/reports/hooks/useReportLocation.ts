import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { LocationService } from '../../../services/LocationService';
import type { LocationWithLiveStatus } from '../../../types/entities';

// Gleicher Query-Key wie `useLocationDetail.ts` (Location Detail) — dieselbe
// `LocationService.getLocationById()`-Antwort, dadurch Cache-Wiederverwendung, wenn der Report-Flow
// (wie vorgesehen) von der Location-Detail-Seite aus gestartet wird. `notFound` unterscheidet den
// (fehlerfreien) Fall „keine Zeile gefunden" von einem echten Ladefehler, analog zu
// `useLocationDetail.ts`.
export function useReportLocation(locationId: string) {
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
