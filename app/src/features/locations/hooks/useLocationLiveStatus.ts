import { useIsFocused } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { AppError } from '../../../lib/errors';
import { RealtimeService } from '../../../services/RealtimeService';
import { ReportService } from '../../../services/ReportService';
import type { LocationLiveStatus } from '../../../types/entities';

// Gleiches Query-Key-Schema wie im Live-Map-Feature (`features/map/hooks/useMapLocations.ts`) —
// dieselbe aggregierte View `location_live_status`, dadurch Cache-Wiederverwendung, wenn dieselbe
// Location zuvor bereits auf der Karte sichtbar war. Realtime-Subscription über den bestehenden
// zentralen `RealtimeService` (ADR-003), gezielte Invalidierung nur des Live-Status-Query-Keys dieser
// einen Location — kein kompletter Reload. Nur aktiv, während der Screen fokussiert ist (`useIsFocused`,
// ADR-003 „nur sichtbare Screens abonnieren").
export function useLocationLiveStatus(locationId: string) {
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const query = useQuery<LocationLiveStatus | null, AppError>({
    queryKey: ['locations', 'liveStatus', locationId],
    queryFn: () => ReportService.getLiveStatus(locationId),
  });

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    const unsubscribe = RealtimeService.subscribeToReports((reports) => {
      const isAffected = reports.some((report) => report.location_id === locationId);

      if (isAffected) {
        queryClient.invalidateQueries({ queryKey: ['locations', 'liveStatus', locationId] });
      }
    });

    return unsubscribe;
  }, [isFocused, locationId, queryClient]);

  return {
    liveStatus: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
