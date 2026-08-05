import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReviewService } from '../../../services/ReviewService';
import type { Review } from '../../../types/entities';

// Query-Key exakt nach dem in docs/ADR/001-State-Management.md genannten Beispiel
// `['reviews','location',locationId]`. Durchschnitt/Anzahl werden clientseitig aus der bereits
// geladenen Liste abgeleitet (kein aggregierender Service/View für Reviews vorgesehen, anders als bei
// `location_live_status` für Reports).
export function useLocationReviews(locationId: string) {
  const query = useQuery<Review[], AppError>({
    queryKey: ['reviews', 'location', locationId],
    queryFn: () => ReviewService.getReviews({ targetType: 'location', targetId: locationId }),
  });

  const reviews = query.data ?? [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : null;

  return {
    reviews,
    averageRating,
    reviewCount,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
