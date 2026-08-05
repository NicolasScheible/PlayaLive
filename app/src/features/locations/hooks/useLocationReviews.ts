import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReviewService } from '../../../services/ReviewService';
import { useAuthStore } from '../../../store/authStore';
import type { Review } from '../../../types/entities';

// Query-Key exakt nach dem in docs/ADR/001-State-Management.md genannten Beispiel
// `['reviews','location',locationId]`. Durchschnitt/Anzahl werden clientseitig aus der bereits
// geladenen Liste abgeleitet (kein aggregierender Service/View für Reviews vorgesehen, anders als bei
// `location_live_status` für Reports). `ownReview` (Auftrag Punkt 2/3: eigene Review bearbeiten/
// löschen) wird ohne zusätzlichen Request aus derselben Liste abgeleitet — `reviews_select_active_or_
// admin` (20260804122738_reviews.sql) liefert die eigene Review ohnehin immer mit, auch falls sie
// (irrelevant hier, da nur Soft-Delete durch den Nutzer selbst möglich ist) bereits gelöscht wäre.
export function useLocationReviews(locationId: string) {
  const session = useAuthStore((state) => state.session);

  const query = useQuery<Review[], AppError>({
    queryKey: ['reviews', 'location', locationId],
    queryFn: () => ReviewService.getReviews({ targetType: 'location', targetId: locationId }),
  });

  const reviews = query.data ?? [];
  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : null;
  const ownReview = reviews.find((review) => review.user_id === session?.user.id) ?? null;

  return {
    reviews,
    averageRating,
    reviewCount,
    ownReview,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
