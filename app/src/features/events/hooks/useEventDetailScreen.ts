import { useUserLocation } from '../../../hooks/useUserLocation';
import { distanceMeters } from '../../../utils/distance';

import { useEventDetail } from './useEventDetail';
import { useEventFavorite } from './useEventFavorite';
import { useEventLocationHappyHours } from './useEventLocationHappyHours';
import { useEventLocationLiveStatus } from './useEventLocationLiveStatus';
import { useEventLocationSpecials } from './useEventLocationSpecials';

// Einziger Hook, den `EventDetailScreen.tsx` aufruft (analog zu `useLocationDetailScreen.ts`/
// `useMapScreen.ts`) — bündelt Event-Grunddaten (inkl. Location und Artists), Live-Auslastung der
// Location, aktive Happy Hours/Specials der Location, Favoriten-Status und Distanz. Nur die
// Grunddaten (`useEventDetail`) bestimmen den Top-Level-Zustand (Loading/Error/Not-Found) — die
// übrigen Sektionen behalten ihren eigenen Lade-/Fehlerzustand, wie bereits im Location-Detail-Feature.
export function useEventDetailScreen(eventId: string) {
  const detail = useEventDetail(eventId);
  const locationId = detail.event?.location.id ?? null;

  const liveStatus = useEventLocationLiveStatus(locationId);
  const happyHours = useEventLocationHappyHours(locationId);
  const specials = useEventLocationSpecials(locationId);
  const favorite = useEventFavorite(eventId);
  const userLocation = useUserLocation();

  const location = detail.event?.location ?? null;
  const distance =
    userLocation.coords && location && location.latitude !== null && location.longitude !== null
      ? distanceMeters(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          location.latitude,
          location.longitude,
        )
      : null;

  return {
    event: detail.event,
    distanceMeters: distance,
    isLoading: detail.isLoading,
    isError: detail.isError,
    error: detail.error,
    notFound: detail.notFound,
    liveStatus,
    happyHours,
    specials,
    favorite,
  };
}
