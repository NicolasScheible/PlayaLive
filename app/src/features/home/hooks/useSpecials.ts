import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { SpecialService } from '../../../services/SpecialService';
import type { Special } from '../../../types/entities';

import { useLocations } from './useLocations';

// Specials gemäß docs/PRD.md Kapitel 10 (Home: Teil von „Happy Hours & Specials", Kapitel 7).
// `getActiveSpecials()` filtert bereits standortübergreifend nach aktuellem Datum
// (SpecialService.ts).
export type SpecialWithLocationName = Special & { locationName: string };

export function useSpecials() {
  const specialsQuery = useQuery<Special[], AppError>({
    queryKey: ['home', 'specials'],
    queryFn: () => SpecialService.getActiveSpecials(),
  });
  const locationsQuery = useLocations();

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );

  const specials: SpecialWithLocationName[] = (specialsQuery.data ?? []).map((special) => ({
    ...special,
    locationName: locationNameById.get(special.location_id) ?? 'Unbekannte Location',
  }));

  return {
    specials,
    isLoading: specialsQuery.isLoading || locationsQuery.isLoading,
    isError: specialsQuery.isError || locationsQuery.isError,
    error: specialsQuery.error ?? locationsQuery.error ?? null,
    // Ermöglicht einen gezielten Retry nur dieser Section (siehe ErrorState.tsx `onRetry`).
    retry: () => {
      specialsQuery.refetch();
      locationsQuery.refetch();
    },
  };
}
