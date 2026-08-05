import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { SpecialService } from '../../../services/SpecialService';
import type { Special } from '../../../types/entities';

// Gleicher Query-Key wie im Live-Map-Feature (`useSelectedLocationDetail.ts`) — dieselbe Abfrage
// (nur bereits aktive Einträge, `SpecialService.getActiveSpecialsForLocation`).
export function useLocationSpecials(locationId: string) {
  const query = useQuery<Special[], AppError>({
    queryKey: ['locations', 'activeSpecials', locationId],
    queryFn: () => SpecialService.getActiveSpecialsForLocation(locationId),
  });

  return {
    specials: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
