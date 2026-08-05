import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import type { Event } from '../../../types/entities';

// „Heute stattfindende Events" (Auftrag Punkt 6) — wiederverwendet `EventService.getUpcomingEvents`
// mit explizitem `from`/`to` für den heutigen Tag (lokale Gerätezeit) statt einer neuen Service-Methode
// (`EventFilters.from`/`.to` decken diesen Fall bereits ab). Reine Vorschau: kein Klick-Handling, keine
// Detaildaten — das übernimmt der aufrufende Screen.
export type EventWithLiveFlag = Event & { isLive: boolean };

function startOfToday(): Date {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

function endOfToday(): Date {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
}

export function useLocationTodayEvents(locationId: string) {
  const query = useQuery<Event[], AppError>({
    queryKey: ['locations', 'todayEvents', locationId],
    queryFn: () =>
      EventService.getUpcomingEvents({
        locationId,
        from: startOfToday().toISOString(),
        to: endOfToday().toISOString(),
      }),
  });

  const now = new Date().toISOString();
  // „isLive" folgt derselben Bedingung wie `EventService.getCurrentEvents` (start_time <= now <=
  // end_time) — hier clientseitig auf der bereits geladenen Tagesliste berechnet statt eines
  // zusätzlichen Requests.
  const events: EventWithLiveFlag[] = (query.data ?? []).map((event) => ({
    ...event,
    isLive: event.start_time <= now && (event.end_time === null || event.end_time >= now),
  }));

  return {
    events,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
