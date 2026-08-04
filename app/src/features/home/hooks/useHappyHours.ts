import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { HappyHourService } from '../../../services/HappyHourService';
import type { HappyHour } from '../../../types/entities';

import { useLocations } from './useLocations';

// Happy Hours gemäß docs/PRD.md Kapitel 10 (Home: „Happy Hours"). `getActiveHappyHours()` filtert
// bereits standortübergreifend nach dem heutigen Wochentag (HappyHourService.ts).
export type HappyHourWithLocationName = HappyHour & { locationName: string };

export function useHappyHours() {
  const happyHoursQuery = useQuery<HappyHour[], AppError>({
    queryKey: ['home', 'happyHours'],
    queryFn: () => HappyHourService.getActiveHappyHours(),
  });
  const locationsQuery = useLocations();

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );

  const happyHours: HappyHourWithLocationName[] = (happyHoursQuery.data ?? []).map((happyHour) => ({
    ...happyHour,
    locationName: locationNameById.get(happyHour.location_id) ?? 'Unbekannte Location',
  }));

  return {
    happyHours,
    isLoading: happyHoursQuery.isLoading || locationsQuery.isLoading,
    isError: happyHoursQuery.isError || locationsQuery.isError,
    error: happyHoursQuery.error ?? locationsQuery.error ?? null,
  };
}
