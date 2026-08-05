import { useArtistCurrentEventDetail } from './useArtistCurrentEventDetail';
import { useArtistDetail } from './useArtistDetail';
import { useArtistEvents } from './useArtistEvents';
import { useArtistFavorite } from './useArtistFavorite';

// Einziger Hook, den `ArtistDetailScreen.tsx` aufruft (analog zu `useEventDetailScreen.ts`/
// `useLocationDetailScreen.ts`) — bündelt Künstler-Grunddaten, kommende Events, aktuell laufendes
// Event (inkl. Location) und Favoriten-Status. Nur die Grunddaten (`useArtistDetail`) bestimmen den
// Top-Level-Zustand (Loading/Error/Not-Found) — die übrigen Sektionen behalten ihren eigenen
// Lade-/Fehlerzustand, wie bereits in den vorherigen Detail-Features.
export function useArtistDetailScreen(artistId: string) {
  const detail = useArtistDetail(artistId);
  const events = useArtistEvents(artistId);
  const currentEventDetail = useArtistCurrentEventDetail(events.currentEvent?.id ?? null);
  const favorite = useArtistFavorite(artistId);

  return {
    artist: detail.artist,
    isLoading: detail.isLoading,
    isError: detail.isError,
    error: detail.error,
    notFound: detail.notFound,
    upcomingEvents: events.upcomingEvents,
    isEventsLoading: events.isLoading,
    isEventsError: events.isError,
    eventsError: events.error,
    currentEventDetail,
    favorite,
  };
}
