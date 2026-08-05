import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReportService } from '../../../services/ReportService';
import type { CreateReportInput } from '../../../types/dto';
import type { Report } from '../../../types/entities';

// Report erstellen gemäß Auftrag Punkt 2/4/5: ausschließlich über den bestehenden
// `ReportService.createReport()` — Validierung, Rate Limiting, Geofencing und Trust-Score-Gewichtung
// laufen bereits dort bzw. serverseitig (siehe ReportService.ts/reports-Migration), keine eigene Logik
// hier. Auftrag Punkt 6 „Cache aktualisieren": invalidiert denselben Query-Key wie
// `useReportLocationLiveStatus`/`useLocationLiveStatus` (`['locations','liveStatus',locationId]`) —
// die Realtime-Subscription aktualisiert diesen Key ohnehin, diese Invalidierung sorgt zusätzlich für
// eine sofortige Aktualisierung auf diesem Screen, ohne auf den Realtime-Roundtrip zu warten.
export function useCreateReport(locationId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<Report, AppError, CreateReportInput>({
    mutationFn: (input) => ReportService.createReport(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', 'liveStatus', locationId] });
    },
  });

  return {
    createReport: (input: CreateReportInput) => mutation.mutate(input),
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ?? null,
    reset: mutation.reset,
  };
}
