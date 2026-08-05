import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReviewService } from '../../../services/ReviewService';
import type { UpdateReviewInput } from '../../../types/dto';
import type { Review, ReviewTargetType } from '../../../types/entities';

// Review bearbeiten (Auftrag Punkt 2) — ausschließlich über den bestehenden
// `ReviewService.updateReview()`. `targetType`/`targetId` werden zusätzlich zur Review-ID entgegen-
// genommen, da sie ausschließlich für die Cache-Invalidierung (denselben Query-Key wie
// `useCreateReview`) benötigt werden, nicht für den eigentlichen Request.
export function useUpdateReview() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Review,
    AppError,
    { reviewId: string; targetType: ReviewTargetType; targetId: string; input: UpdateReviewInput }
  >({
    mutationFn: ({ reviewId, input }) => ReviewService.updateReview(reviewId, input),
    onSuccess: (_review, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', variables.targetType, variables.targetId],
      });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'own'] });
    },
  });

  return {
    updateReview: (
      reviewId: string,
      targetType: ReviewTargetType,
      targetId: string,
      input: UpdateReviewInput,
    ) => mutation.mutate({ reviewId, targetType, targetId, input }),
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ?? null,
  };
}
