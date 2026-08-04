import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import type { Event } from '../../../types/entities';

import type { EventWithLocationName } from './useCurrentActs';
import { useLocations } from './useLocations';

// „Nächster Act" gemäß docs/PRD.md Kapitel 10 — das zeitlich nächste, noch nicht begonnene Event
// (`EventService.getUpcomingEvents()`, bereits aufsteigend nach start_time sortiert). Liefert bewusst
// keine Künstler-Lineup-Auflösung (kein `getEventById`-Zusatzaufruf): `EventCard` (src/components/)
// zeigt ohnehin keine Künstlerdaten (siehe dortiger Kommentar) — Location-Name genügt, analog zu
// `useCurrentActs`.
export function useNextAct() {
  const eventsQuery = useQuery<Event[], AppError>({
    queryKey: ['home', 'nextAct'],
    queryFn: () => EventService.getUpcomingEvents(),
  });
  const locationsQuery = useLocations();

  const nextEvent = eventsQuery.data?.[0] ?? null;
  const locationName = nextEvent
    ? (locationsQuery.data?.find((location) => location.id === nextEvent.location_id)?.name ??
      'Unbekannte Location')
    : null;

  const nextAct: EventWithLocationName | null =
    nextEvent && locationName ? { ...nextEvent, locationName } : null;

  return {
    nextAct,
    isLoading: eventsQuery.isLoading || locationsQuery.isLoading,
    isError: eventsQuery.isError || locationsQuery.isError,
    error: eventsQuery.error ?? locationsQuery.error ?? null,
  };
}
