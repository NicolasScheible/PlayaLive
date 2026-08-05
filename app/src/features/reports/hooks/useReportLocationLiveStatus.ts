import { useIsFocused } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import type { AppError } from '../../../lib/errors';
import { RealtimeService } from '../../../services/RealtimeService';
import { ReportService } from '../../../services/ReportService';
import type { LocationLiveStatus } from '../../../types/entities';

// Gleiches Query-Key-Schema wie im Location-Detail-/Live-Map-/Event-Detail-Feature
// (`['locations','liveStatus',id]`, siehe `useLocationLiveStatus.ts`) — dieselbe aggregierte View
// `location_live_status`, dadurch Cache-Wiederverwendung. Realtime-Subscription über den bestehenden
// zentralen `RealtimeService` (ADR-003, Auftrag Punkt 8: „bestehende Realtime-Infrastruktur nutzen,
// keine neue Subscription entwickeln") — Struktur 1:1 übernommen von `useLocationLiveStatus.ts`, hier
// erneut dupliziert statt cross-feature importiert (features/README.md: „ausschließlich über
// geteilte Services aus src/services/, nie direkt auf ein anderes Feature-Modul"). Nur aktiv, während
// der Screen fokussiert ist (ADR-003 „nur sichtbare Screens abonnieren").
export function useReportLocationLiveStatus(locationId: string) {
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
