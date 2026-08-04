import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { ReviewRepository } from '../repositories/ReviewRepository';
import type {
  CreateReviewFlagInput,
  CreateReviewInput,
  GetReviewsFilters,
  UpdateReviewInput,
} from '../types/dto';
import type { Review } from '../types/entities';

import { AuthService } from './AuthService';
import { isValidRating, validateCreateReviewInput } from './validation/reviewValidation';

// Service Layer für Reviews (siehe docs/Architecture.md Kapitel 8/9, docs/API.md Kapitel 9). Mit
// Repository-Schicht (ReviewRepository.ts) gemäß Architekturentscheidung 5 — der Service übernimmt
// Validierung, Business-Logik-Koordination und Fehlerübersetzung, die Repository-Schicht ausschließlich
// den Datenzugriff. Existenzprüfung der Zielressource ist serverseitig als DB-Trigger durchgesetzt
// (supabase/migrations/20260804122738_reviews.sql).
async function requireUserId(): Promise<string> {
  const { session } = await AuthService.getSession();

  if (!session) {
    const error: AppError = {
      code: 'AUTH_SESSION_MISSING',
      messageKey: 'errors.auth.AUTH_SESSION_MISSING',
      message: 'Du musst angemeldet sein, um diese Aktion auszuführen.',
      technicalMessage: 'No active session',
    };
    throw error;
  }

  return session.user.id;
}

function validationFailed(errors: string[]): AppError {
  return {
    code: 'VALIDATION_ERROR',
    messageKey: 'errors.database.VALIDATION_ERROR',
    message: errors[0],
    technicalMessage: errors.join(' '),
  };
}

export const ReviewService = {
  // docs/API.md Kapitel 9 „Eigene Bewertung ... zu einer Location oder einem Artist erstellen".
  async createReview(input: CreateReviewInput): Promise<Review> {
    const validationErrors = validateCreateReviewInput(input);

    if (validationErrors.length > 0) {
      throw validationFailed(validationErrors);
    }

    const userId = await requireUserId();

    try {
      return await ReviewRepository.insertReview({
        user_id: userId,
        target_type: input.targetType,
        target_id: input.targetId,
        rating: input.rating,
        comment_text: input.commentText ?? null,
      });
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  // docs/API.md Kapitel 9 „Eigene Bewertung bearbeiten" — Eigentümerschaft wird serverseitig über RLS
  // erzwungen (reviews_update_own_or_admin), nicht clientseitig.
  async updateReview(reviewId: string, input: UpdateReviewInput): Promise<Review> {
    if (input.rating !== undefined && !isValidRating(input.rating)) {
      throw validationFailed(['Die Bewertung muss zwischen 1 und 5 Sternen liegen.']);
    }

    try {
      return await ReviewRepository.updateReview(reviewId, {
        ...(input.rating !== undefined ? { rating: input.rating } : {}),
        ...(input.commentText !== undefined ? { comment_text: input.commentText } : {}),
      });
    } catch (error) {
      throw mapDatabaseError(error, {
        notFound: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Diese Bewertung wurde nicht gefunden oder gehört dir nicht.',
        },
      });
    }
  },

  // docs/API.md Kapitel 9 „Eigene Bewertung ... löschen" — Soft Delete über `deleted_at`
  // (docs/Database.md 2.12), kein endgültiges Löschen durch den Nutzer selbst.
  async deleteReview(reviewId: string): Promise<void> {
    try {
      await ReviewRepository.updateReview(reviewId, { deleted_at: new Date().toISOString() });
    } catch (error) {
      throw mapDatabaseError(error, {
        notFound: {
          code: 'REVIEW_NOT_FOUND',
          message: 'Diese Bewertung wurde nicht gefunden oder gehört dir nicht.',
        },
      });
    }
  },

  // docs/API.md Kapitel 9 „Bewertungen ... abrufen" — kein Login erforderlich (öffentlich lesbar,
  // siehe reviews_select_active_or_admin in 20260804122738_reviews.sql).
  async getReviews(filters: GetReviewsFilters): Promise<Review[]> {
    try {
      return await ReviewRepository.findByTarget(filters);
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  // docs/API.md Kapitel 9 „Missbräuchliche Bewertung melden (review_flags)".
  async flagReview(input: CreateReviewFlagInput): Promise<void> {
    const userId = await requireUserId();

    try {
      await ReviewRepository.insertReviewFlag({
        review_id: input.reviewId,
        flagged_by_user_id: userId,
        reason: input.reason,
      });
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },
};
