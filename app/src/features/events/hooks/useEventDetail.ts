import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import type { EventWithDetails } from '../../../types/entities';

// Query-Key nach dem in docs/ADR/001-State-Management.md verbindlich festgelegten, domänenbasierten
// Schema (analog zum dort genannten Beispiel `['locations','detail',id]`). `notFound` unterscheidet den
// (fehlerfreien) Fall „keine Zeile gefunden" (`EventService.getEventById` liefert dann `null`) vom
// echten Ladefehler — exakt wie `useLocationDetail.ts` im Location-Detail-Feature.
export function useEventDetail(eventId: string) {
  const query = useQuery<EventWithDetails | null, AppError>({
    queryKey: ['events', 'detail', eventId],
    queryFn: () => EventService.getEventById(eventId),
  });

  return {
    event: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
    notFound: query.isSuccess && query.data === null,
  };
}
