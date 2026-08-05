import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReportService } from '../../../services/ReportService';
import type { LocationLiveStatus } from '../../../types/entities';

// Gleicher Query-Key wie im Live-Map- und Location-Detail-Feature (`['locations','liveStatus',id]`) —
// dieselbe aggregierte View `location_live_status`, dadurch Cache-Wiederverwendung statt eines
// zusätzlichen Requests (Auftrag Punkt 10: „Keine doppelten Requests"). Auftrag Punkt 8 verlangt
// ausschließlich die aktuelle Auslastung, keine Realtime-Aktualisierung — anders als im vollständigen
// Location-Detail-Screen daher bewusst ohne `RealtimeService`-Subscription („Keine neue Logik
// entwickeln"). `locationId` ist `null`, solange das Event (und damit seine Location) noch lädt.
export function useEventLocationLiveStatus(locationId: string | null) {
  const query = useQuery<LocationLiveStatus | null, AppError>({
    queryKey: ['locations', 'liveStatus', locationId],
    queryFn: () => ReportService.getLiveStatus(locationId as string),
    enabled: locationId !== null,
  });

  return {
    liveStatus: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
