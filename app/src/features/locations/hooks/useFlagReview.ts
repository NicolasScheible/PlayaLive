import { useMutation } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { ReviewService } from '../../../services/ReviewService';
import type { CreateReviewFlagInput } from '../../../types/dto';

// Review melden (Auftrag Punkt 4, bestehender `review_flags`-Mechanismus über
// `ReviewService.flagReview`, keine neue Tabelle). Lokal in `features/locations/` (siehe
// `useDeleteReview.ts` zur Begründung der Feature-Isolation). Keine Cache-Invalidierung nötig — Flags
// sind nicht Teil der angezeigten Review-Liste. `flagReview` nimmt einen optionalen
// `onSuccess`-Callback pro Aufruf entgegen (TanStack-Query-Standardmechanismus), damit der aufrufende
// Screen das Bottom Sheet direkt nach Erfolg schließen kann, ohne einen State-Update-in-`useEffect`
// auszulösen.
export function useFlagReview() {
  const mutation = useMutation<void, AppError, CreateReviewFlagInput>({
    mutationFn: (input) => ReviewService.flagReview(input),
  });

  return {
    flagReview: (input: CreateReviewFlagInput, options?: { onSuccess?: () => void }) =>
      mutation.mutate(input, options),
    isSubmitting: mutation.isPending,
    error: mutation.error ?? null,
  };
}
