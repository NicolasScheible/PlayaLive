import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReviewService } from '../../../services/ReviewService';
import type { CreateReviewInput } from '../../../types/dto';
import type { Review } from '../../../types/entities';

// Review erstellen (Auftrag Punkt 1) — ausschließlich über den bestehenden
// `ReviewService.createReview()`, Validierung läuft bereits dort/serverseitig. Query-Keys exakt nach
// dem in `useLocationReviews.ts` etablierten Muster (`['reviews', targetType, targetId]`) sowie
// `['reviews', 'own']` (`useOwnReviews.ts`) — Auftrag Punkt 7 „Bestehende Query Keys wiederverwenden".
// Kein optimistisches Update: im gesamten Projekt bislang keine manuelle Cache-Patch-Logik (siehe
// `useLocationFavorite.ts`), einfache Invalidierung nach Erfolg genügt (CLAUDE.md „keine vorzeitigen
// Abstraktionen").
export function useCreateReview() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Review, AppError, CreateReviewInput>({
    mutationFn: (input) => ReviewService.createReview(input),
    onSuccess: (_review, input) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', input.targetType, input.targetId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'own'] });
    },
  });

  return {
    createReview: (input: CreateReviewInput) => mutation.mutate(input),
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ?? null,
  };
}
