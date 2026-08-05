import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { SpecialService } from '../../../services/SpecialService';
import type { Special } from '../../../types/entities';

// Gleicher Query-Key wie im Location-Detail-Feature — dieselbe Abfrage (nur bereits aktive Einträge,
// `SpecialService.getActiveSpecialsForLocation`) für die Location des Events. Keine direkte
// Event↔Special-Beziehung im Datenmodell — siehe Begründung in `useEventLocationHappyHours.ts`.
export function useEventLocationSpecials(locationId: string | null) {
  const query = useQuery<Special[], AppError>({
    queryKey: ['locations', 'activeSpecials', locationId],
    queryFn: () => SpecialService.getActiveSpecialsForLocation(locationId as string),
    enabled: locationId !== null,
  });

  return {
    specials: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
