import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import type { Event } from '../../../types/entities';

import type { EventWithLocationName } from './useCurrentActs';
import { useLocations } from './useLocations';

// Highlights heute gemäß docs/PRD.md Kapitel 10 (Home: „Highlights (Top-Events, Top-Locations,
// Trends)"). Umgesetzt als „heutige Events" (docs/API.md Kapitel 4 „Events nach Datum/Zeitraum
// filtern") — eine Rangfolge nach „Top"/„Trends" ist in docs/PRD.md/docs/Database.md nicht mit einem
// Kriterium hinterlegt (kein Report-/Favoriten-Zähler o. Ä. dokumentiert) und wird hier bewusst NICHT
// erfunden; „Party Radar" ist in keinem Dokument als konkrete Funktion spezifiziert und daher ebenfalls
// nicht Teil dieser Umsetzung. Location-Namen analog zu `useCurrentActs`/`useNextAct` über den
// geteilten `useLocations()`-Cache aufgelöst.
function startOfToday(): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return date.toISOString();
}

function endOfToday(): string {
  const date = new Date();
  date.setHours(23, 59, 59, 999);

  return date.toISOString();
}

export function useTodayHighlights() {
  const eventsQuery = useQuery<Event[], AppError>({
    queryKey: ['home', 'todayHighlights'],
    queryFn: () => EventService.getUpcomingEvents({ from: startOfToday(), to: endOfToday() }),
  });
  const locationsQuery = useLocations();

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );

  const events: EventWithLocationName[] = (eventsQuery.data ?? []).map((event) => ({
    ...event,
    locationName: locationNameById.get(event.location_id) ?? 'Unbekannte Location',
  }));

  return {
    events,
    isLoading: eventsQuery.isLoading || locationsQuery.isLoading,
    isError: eventsQuery.isError || locationsQuery.isError,
    error: eventsQuery.error ?? locationsQuery.error ?? null,
  };
}
