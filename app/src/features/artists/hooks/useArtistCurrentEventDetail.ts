import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import type { EventWithDetails } from '../../../types/entities';

// Gleicher Query-Key wie im Event-Detail-Feature (`['events','detail',id]`) — dieselbe Abfrage
// (`EventService.getEventById`, liefert Event inkl. Location), dadurch Cache-Wiederverwendung, falls
// der Nutzer anschließend zum vollständigen Event-Detail-Screen navigiert. Nur aktiv, solange
// `currentEventId` vorliegt (Auftrag Punkt 5: „falls laut Datenmodell aktuell ein Event läuft") — die
// Location des aktuell laufenden Events wird darüber mitgeliefert, ohne einen eigenen
// `LocationService`-Aufruf.
export function useArtistCurrentEventDetail(currentEventId: string | null) {
  const query = useQuery<EventWithDetails | null, AppError>({
    queryKey: ['events', 'detail', currentEventId],
    queryFn: () => EventService.getEventById(currentEventId as string),
    enabled: currentEventId !== null,
  });

  return {
    eventDetail: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
