import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import type { AppError } from '../../../lib/errors';
import { ArtistService } from '../../../services/ArtistService';
import { EventService } from '../../../services/EventService';
import { LocationService } from '../../../services/LocationService';
import type { Artist, Event, Location } from '../../../types/entities';

const SEARCH_DEBOUNCE_MS = 300;

function matches(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

// Globale Suche (Auftrag Punkt 2/3/6): sucht gleichzeitig über die bereits vorhandenen Services
// `LocationService.getLocations()`, `EventService.getUpcomingEvents()`, `ArtistService.getArtists()` —
// keiner davon unterstützt serverseitige Textsuche, daher werden die vollständigen Listen geladen und
// clientseitig nach Name/Titel gefiltert. Query-Keys exakt wie an anderer Stelle bereits etabliert
// (`useOwnReviews.ts`/`useFavoriteEvents.ts`: `['locations','list',{}]`, `['events','list',{}]`,
// `['artists','list',{}]`) — Cache-Wiederverwendung mit Home/Favoriten/Profil statt eigener Requests.
// `enabled` hängt vom debounced Suchtext ab: bei leerem Suchtext werden keine Requests ausgelöst
// (Auftrag Punkt 3 „Leerer Suchtext zeigt keinen Request"), und der Debounce verhindert, dass jeder
// Tastendruck sofort einen neuen Fetch/eine neue Filterung auslöst (Auftrag Punkt 6 „Keine
// Mehrfachabfragen").
export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  const isQueryPresent = normalizedQuery.length > 0;

  const locationsQuery = useQuery<Location[], AppError>({
    queryKey: ['locations', 'list', {}],
    queryFn: () => LocationService.getLocations(),
    enabled: isQueryPresent,
  });

  const eventsQuery = useQuery<Event[], AppError>({
    queryKey: ['events', 'list', {}],
    queryFn: () => EventService.getUpcomingEvents(),
    enabled: isQueryPresent,
  });

  const artistsQuery = useQuery<Artist[], AppError>({
    queryKey: ['artists', 'list', {}],
    queryFn: () => ArtistService.getArtists(),
    enabled: isQueryPresent,
  });

  const locations = isQueryPresent
    ? (locationsQuery.data ?? []).filter((location) => matches(location.name, normalizedQuery))
    : [];
  const events = isQueryPresent
    ? (eventsQuery.data ?? []).filter((event) => matches(event.title, normalizedQuery))
    : [];
  const artists = isQueryPresent
    ? (artistsQuery.data ?? []).filter((artist) => matches(artist.name, normalizedQuery))
    : [];

  const isLoading =
    isQueryPresent && (locationsQuery.isLoading || eventsQuery.isLoading || artistsQuery.isLoading);
  const isError =
    isQueryPresent && (locationsQuery.isError || eventsQuery.isError || artistsQuery.isError);
  const error = locationsQuery.error ?? eventsQuery.error ?? artistsQuery.error ?? null;
  const hasResults = locations.length > 0 || events.length > 0 || artists.length > 0;
  const isEmpty = isQueryPresent && !isLoading && !isError && !hasResults;

  return {
    query,
    setQuery,
    isQueryPresent,
    locations,
    events,
    artists,
    isLoading,
    isError,
    error,
    isEmpty,
  };
}
