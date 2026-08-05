import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ArtistService } from '../../../services/ArtistService';
import { LocationService } from '../../../services/LocationService';
import { ReviewService } from '../../../services/ReviewService';
import type { Artist, Location, Review } from '../../../types/entities';

export type OwnReviewWithTargetName = Review & { targetName: string };

// Eigene Reviews gemäß Auftrag Punkt 4. `ReviewService.getOwnReviews()` liefert nur `target_type`/
// `target_id` — für die Anzeige (und die Navigation zum jeweiligen Detail-Screen) wird der Name der
// Location/des Artists per Lookup-Map ergänzt, analog zu `useArtistEvents.ts`/`useFavoriteEvents.ts`
// (zwei Lookups statt einem, da Reviews sowohl Locations als auch Artists betreffen können). Beide
// Lookup-Abfragen nutzen dieselben Query-Keys wie an anderer Stelle bereits etabliert
// (`['locations','list',{}]`, `['artists','list',{}]`) — Cache-Wiederverwendung, keine doppelten
// Requests.
export function useOwnReviews() {
  const reviewsQuery = useQuery<Review[], AppError>({
    queryKey: ['reviews', 'own'],
    queryFn: () => ReviewService.getOwnReviews(),
  });

  const locationsQuery = useQuery<Location[], AppError>({
    queryKey: ['locations', 'list', {}],
    queryFn: () => LocationService.getLocations(),
  });

  const artistsQuery = useQuery<Artist[], AppError>({
    queryKey: ['artists', 'list', {}],
    queryFn: () => ArtistService.getArtists(),
  });

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );
  const artistNameById = new Map(
    (artistsQuery.data ?? []).map((artist) => [artist.id, artist.name]),
  );

  const reviews: OwnReviewWithTargetName[] = (reviewsQuery.data ?? []).map((review) => ({
    ...review,
    targetName:
      (review.target_type === 'location'
        ? locationNameById.get(review.target_id)
        : artistNameById.get(review.target_id)) ?? 'Unbekannt',
  }));

  return {
    reviews,
    isLoading: reviewsQuery.isLoading || locationsQuery.isLoading || artistsQuery.isLoading,
    isError: reviewsQuery.isError || locationsQuery.isError || artistsQuery.isError,
    error: reviewsQuery.error ?? locationsQuery.error ?? artistsQuery.error ?? null,
  };
}
