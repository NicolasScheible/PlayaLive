import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { HappyHourService } from '../../../services/HappyHourService';
import type { HappyHour } from '../../../types/entities';

// Gleicher Query-Key wie im Live-Map-Feature (`useSelectedLocationDetail.ts`) — dieselbe Abfrage
// (nur bereits aktive Einträge, `HappyHourService.getActiveHappyHoursForLocation`).
export function useLocationHappyHours(locationId: string) {
  const query = useQuery<HappyHour[], AppError>({
    queryKey: ['locations', 'activeHappyHours', locationId],
    queryFn: () => HappyHourService.getActiveHappyHoursForLocation(locationId),
  });

  return {
    happyHours: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
