import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReportService } from '../../../services/ReportService';
import type { Location, LocationLiveStatus } from '../../../types/entities';

import { useLocations } from './useLocations';

// Live-Auslastung gemäß docs/PRD.md Kapitel 10 (Home: „Live-Auslastung-Übersicht"). Kombiniert
// `LocationService.getLocations()` mit `ReportService.getLiveStatus()` je Location — beide Services
// bestehen bereits unverändert (kein Eingriff in die abgeschlossene Backend-Infrastruktur), die
// Zusammenführung mehrerer Services ist reine Hook-Komposition (docs/Architecture.md Kapitel 8:
// „Service Layer" bleibt pro Domäne getrennt, Hooks orchestrieren).
export type LocationOccupancy = {
  location: Location;
  liveStatus: LocationLiveStatus | null;
};

export function useLiveOccupancy() {
  const locationsQuery = useLocations();
  const locationIds = (locationsQuery.data ?? []).map((location) => location.id);

  const liveStatusQuery = useQuery<LocationOccupancy[], AppError>({
    queryKey: ['home', 'liveOccupancy', locationIds],
    queryFn: async () => {
      const locations = locationsQuery.data ?? [];
      const liveStatuses = await Promise.all(
        locations.map((location) => ReportService.getLiveStatus(location.id)),
      );

      return locations.map((location, index) => ({ location, liveStatus: liveStatuses[index] }));
    },
    enabled: locationsQuery.isSuccess,
  });

  return {
    occupancies: liveStatusQuery.data ?? [],
    isLoading: locationsQuery.isLoading || liveStatusQuery.isLoading,
    isError: locationsQuery.isError || liveStatusQuery.isError,
    error: locationsQuery.error ?? liveStatusQuery.error ?? null,
    // Ermöglicht einen gezielten Retry nur dieser Section (siehe ErrorState.tsx `onRetry`) — beide
    // zugrundeliegenden Queries erneut anstoßen, unabhängig davon, welche fehlgeschlagen ist.
    retry: () => {
      locationsQuery.refetch();
      liveStatusQuery.refetch();
    },
  };
}
