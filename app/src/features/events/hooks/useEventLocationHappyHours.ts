import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { HappyHourService } from '../../../services/HappyHourService';
import type { HappyHour } from '../../../types/entities';

// Gleicher Query-Key wie im Location-Detail-Feature — dieselbe Abfrage (nur bereits aktive Einträge,
// `HappyHourService.getActiveHappyHoursForLocation`) für die Location des Events. Es gibt keine direkte
// Event↔HappyHour-Beziehung im Datenmodell (docs/Database.md 2.5/2.8) — „falls dem Event zugeordnet"
// (Auftrag Punkt 6) wird daher über die bereits bestehende Location-Beziehung aufgelöst, statt eine
// neue Beziehung zu erfinden.
export function useEventLocationHappyHours(locationId: string | null) {
  const query = useQuery<HappyHour[], AppError>({
    queryKey: ['locations', 'activeHappyHours', locationId],
    queryFn: () => HappyHourService.getActiveHappyHoursForLocation(locationId as string),
    enabled: locationId !== null,
  });

  return {
    happyHours: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
