import { useUserLocation } from '../../../hooks/useUserLocation';
import { distanceMeters } from '../../../utils/distance';

import { useDeleteReview } from './useDeleteReview';
import { useFlagReview } from './useFlagReview';
import { useLocationDetail } from './useLocationDetail';
import { useLocationFavorite } from './useLocationFavorite';
import { useLocationHappyHours } from './useLocationHappyHours';
import { useLocationLiveStatus } from './useLocationLiveStatus';
import { useLocationReviews } from './useLocationReviews';
import { useLocationSpecials } from './useLocationSpecials';
import { useLocationTodayEvents } from './useLocationTodayEvents';

// Einziger Hook, den `LocationDetailScreen.tsx` aufruft (analog zu `useHomeDashboard.ts`/
// `useMapScreen.ts`) — bündelt Grunddaten, Live-Auslastung, Happy Hours, Specials, heutige Events,
// Bewertungen (inkl. Löschen/Melden), Favoriten-Status und Distanz. Jede Sektion behält ihren eigenen
// Lade-/Fehlerzustand (wie auf dem Home Dashboard) statt eines einzigen Screen-weiten Zustands — nur
// die Grunddaten (`useLocationDetail`) bestimmen den Top-Level-Zustand (Loading/Error/Not-Found), da
// ohne sie der gesamte Screen keinen sinnvollen Inhalt hat.
export function useLocationDetailScreen(locationId: string) {
  const detail = useLocationDetail(locationId);
  const liveStatus = useLocationLiveStatus(locationId);
  const happyHours = useLocationHappyHours(locationId);
  const specials = useLocationSpecials(locationId);
  const todayEvents = useLocationTodayEvents(locationId);
  const reviews = useLocationReviews(locationId);
  const deleteReview = useDeleteReview(locationId);
  const flagReview = useFlagReview();
  const favorite = useLocationFavorite(locationId);
  const userLocation = useUserLocation();

  const location = detail.location;
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
    location,
    distanceMeters: distance,
    isLoading: detail.isLoading,
    isError: detail.isError,
    error: detail.error,
    notFound: detail.notFound,
    liveStatus,
    happyHours,
    specials,
    todayEvents,
    reviews,
    deleteReview,
    flagReview,
    favorite,
  };
}
