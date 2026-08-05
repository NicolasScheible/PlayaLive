import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReviewService } from '../../../services/ReviewService';

// Eigene Review löschen (Auftrag Punkt 3, Soft Delete gemäß bestehender Architektur via
// `ReviewService.deleteReview`). Lokal in `features/locations/`, nicht in `features/reviews/`
// importiert — `features/README.md`: „Ein Feature-Modul greift ausschließlich über seinen eigenen
// Service ... zu, nie direkt auf ein anderes Feature-Modul". Query-Keys wie bei `useCreateReview`.
export function useDeleteReview(locationId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, AppError, string>({
    mutationFn: (reviewId) => ReviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'location', locationId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'own'] });
    },
  });

  return {
    deleteReview: (reviewId: string) => mutation.mutate(reviewId),
    isDeleting: mutation.isPending,
    error: mutation.error ?? null,
  };
}
