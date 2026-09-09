import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import type { Event } from '../../../types/entities';

import { useLocations } from './useLocations';

// Aktuelle Acts / „Spielt gerade" gemäß docs/PRD.md Kapitel 10. Nutzt `EventService.getCurrentEvents()`
// (start_time <= now <= end_time) statt `getUpcomingEvents()`, das bereits laufende Events nicht mehr
// liefern würde. Location-Namen kommen aus `useLocations()` (geteilter Cache, siehe dortiger
// Kommentar) statt eines eigenen Lookups je Event.
export type EventWithLocationName = Event & { locationName: string };

export function useCurrentActs() {
  const eventsQuery = useQuery<Event[], AppError>({
    queryKey: ['home', 'currentActs'],
    queryFn: () => EventService.getCurrentEvents(),
  });
  const locationsQuery = useLocations();

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );

  const acts: EventWithLocationName[] = (eventsQuery.data ?? []).map((event) => ({
    ...event,
    locationName: locationNameById.get(event.location_id) ?? 'Unbekannte Location',
  }));

  return {
    acts,
    isLoading: eventsQuery.isLoading || locationsQuery.isLoading,
    isError: eventsQuery.isError || locationsQuery.isError,
    error: eventsQuery.error ?? locationsQuery.error ?? null,
    // Ermöglicht einen gezielten Retry nur dieser Section (siehe ErrorState.tsx `onRetry`).
    retry: () => {
      eventsQuery.refetch();
      locationsQuery.refetch();
    },
  };
}
