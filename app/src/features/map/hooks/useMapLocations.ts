import { useIsFocused } from '@react-navigation/native';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { AppError } from '../../../lib/errors';
import { LocationService } from '../../../services/LocationService';
import { RealtimeService } from '../../../services/RealtimeService';
import { ReportService } from '../../../services/ReportService';
import type { Location, LocationLiveStatus, LocationWithLiveStatus } from '../../../types/entities';

// Query-Keys folgen dem in docs/ADR/001-State-Management.md Kapitel „Entscheidung" verbindlich
// festgelegten Schema (`['locations','list',filters]`, `['locations','detail',id]`) statt eines
// feature-eigenen Präfixes — Locations sind keine Map-spezifische Datenquelle.
//
// Live-Status je Location über `useQueries` statt einer einzelnen kombinierten Abfrage (wie
// `useLiveOccupancy` im Home-Dashboard): nur so kann `RealtimeService.subscribeToReports` gezielt per
// `setQueryData` genau die von einem neuen Report betroffene Location aktualisieren (Auftrag: „Neue
// Reports aktualisieren: Marker, Auslastung, Farbe — ohne kompletten Reload").
export function useMapLocations() {
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const locationsQuery = useQuery<Location[], AppError>({
    queryKey: ['locations', 'list', {}],
    queryFn: () => LocationService.getLocations(),
  });

  const locationsWithCoordinates = (locationsQuery.data ?? []).filter(
    (location) => location.latitude !== null && location.longitude !== null,
  );

  const liveStatusQueries = useQueries({
    queries: locationsWithCoordinates.map(
      (location): UseQueryOptions<LocationLiveStatus | null, AppError> => ({
        queryKey: ['locations', 'liveStatus', location.id],
        queryFn: () => ReportService.getLiveStatus(location.id),
        enabled: locationsQuery.isSuccess,
      }),
    ),
  });

  // ADR-003 „nur sichtbare Screens abonnieren": die Subscription läuft ausschließlich, während der
  // Map-Screen fokussiert ist (nicht nur gemountet — Bottom-Tab-Screens bleiben laut
  // docs/Architecture.md Kapitel 7 vorgesehener 5-Tab-Navigation typischerweise im Hintergrund
  // gemountet).
  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const unsubscribe = RealtimeService.subscribeToReports((reports) => {
      const affectedLocationIds = new Set(reports.map((report) => report.location_id));

      affectedLocationIds.forEach((locationId) => {
        queryClient.invalidateQueries({ queryKey: ['locations', 'liveStatus', locationId] });
      });
    });

    return unsubscribe;
  }, [isFocused, queryClient]);

  const locations: LocationWithLiveStatus[] = locationsWithCoordinates.map((location, index) => ({
    ...location,
    liveStatus: (liveStatusQueries[index]?.data ?? null) as LocationLiveStatus | null,
  }));

  return {
    locations,
    isLoading: locationsQuery.isLoading || liveStatusQueries.some((query) => query.isLoading),
    isError: locationsQuery.isError || liveStatusQueries.some((query) => query.isError),
    error: locationsQuery.error ?? liveStatusQueries.find((query) => query.error)?.error ?? null,
  };
}
