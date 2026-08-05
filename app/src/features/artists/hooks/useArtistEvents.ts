import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ArtistService } from '../../../services/ArtistService';
import { LocationService } from '../../../services/LocationService';
import type { Event, Location } from '../../../types/entities';

// „Kommende Events" (Auftrag Punkt 4) und „Aktuelle Auftritte" (Auftrag Punkt 5) werden aus derselben
// `ArtistService.getArtistEvents()`-Abfrage abgeleitet (eine Abfrage statt zwei, „keine doppelten
// Datenabfragen"). Location-Namen kommen aus `LocationService.getLocations()` (Query-Key
// `['locations','list',{}]`, identisch zum Live-Map-Feature — Cache-Wiederverwendung statt eines
// Lookups je Event), analog zu `useCurrentActs.ts` im Home-Dashboard-Feature. „isLive" folgt derselben
// Bedingung wie `EventService.getCurrentEvents()` (start_time <= now <= end_time) — dieselbe bereits
// etablierte Logik wie in `useLocationTodayEvents.ts`, hier nur auf die bereits geladene Artist-
// Eventliste angewendet statt eines neuen Requests.
export type EventWithLocationName = Event & { locationName: string };

export function useArtistEvents(artistId: string) {
  const eventsQuery = useQuery<Event[], AppError>({
    queryKey: ['artists', 'events', artistId],
    queryFn: () => ArtistService.getArtistEvents(artistId),
  });

  const locationsQuery = useQuery<Location[], AppError>({
    queryKey: ['locations', 'list', {}],
    queryFn: () => LocationService.getLocations(),
  });

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );

  const events: EventWithLocationName[] = (eventsQuery.data ?? []).map((event) => ({
    ...event,
    locationName: locationNameById.get(event.location_id) ?? 'Unbekannte Location',
  }));

  const now = new Date().toISOString();
  const upcomingEvents = events.filter((event) => event.start_time > now);
  const currentEvent =
    events.find(
      (event) => event.start_time <= now && (event.end_time === null || event.end_time >= now),
    ) ?? null;

  return {
    upcomingEvents,
    currentEvent,
    isLoading: eventsQuery.isLoading || locationsQuery.isLoading,
    isError: eventsQuery.isError || locationsQuery.isError,
    error: eventsQuery.error ?? locationsQuery.error ?? null,
  };
}
