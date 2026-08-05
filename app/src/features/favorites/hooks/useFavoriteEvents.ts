import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import { LocationService } from '../../../services/LocationService';
import type { Event, Location } from '../../../types/entities';

import { useFavoriteList } from './useFavoriteList';

export type FavoriteEventWithLocationName = Event & { locationName: string };

// `EventService.getUpcomingEvents()` liefert (ohne Filter) alle künftigen Events — der einzige
// bestehende Service-Aufruf für eine „vollständige Übersicht" aller Events (docs/API.md Kapitel 4 kennt
// keine Methode für vergangene Events). Bereits vergangene, favorisierte Events erscheinen dadurch nicht
// mehr in der Liste — keine neue Service-Methode für diesen Randfall, siehe CLAUDE.md „keine
// vorzeitigen Abstraktionen"/„keine neuen Architekturentscheidungen".
//
// Location-Namen werden wie in `useCurrentActs.ts`/`useArtistEvents.ts` per Lookup-Map aus
// `LocationService.getLocations()` ergänzt (`EventCard` benötigt `locationName`, `Event` selbst enthält
// nur `location_id`) — hier bewusst erneut inline dupliziert statt in den bestehenden Code einzugreifen
// (CLAUDE.md „kein Refactoring funktionierenden Codes"). Gleicher Query-Key `['locations', 'list', {}]`
// wie im Favoriten-Locations-Tab — Cache-Wiederverwendung beim Tab-Wechsel.
export function useFavoriteEvents(enabled: boolean) {
  const eventsResult = useFavoriteList<Event>({
    targetType: 'event',
    entityQueryKey: ['events', 'list', {}],
    fetchEntities: () => EventService.getUpcomingEvents(),
    getId: (event) => event.id,
    enabled,
  });

  const locationsQuery = useQuery<Location[], AppError>({
    queryKey: ['locations', 'list', {}],
    queryFn: () => LocationService.getLocations(),
    enabled,
  });

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );

  const items: FavoriteEventWithLocationName[] = eventsResult.items.map((event) => ({
    ...event,
    locationName: locationNameById.get(event.location_id) ?? 'Unbekannte Location',
  }));

  return {
    items,
    isLoading: eventsResult.isLoading || locationsQuery.isLoading,
    isError: eventsResult.isError || locationsQuery.isError,
    error: eventsResult.error ?? locationsQuery.error ?? null,
    remove: eventsResult.remove,
  };
}
