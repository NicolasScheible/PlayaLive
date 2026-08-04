import type { CreateReviewInput } from '../../types/dto';
import type { ReviewTargetType } from '../../types/entities';

// Clientseitige Vorabvalidierung für Reviews — spiegelt die serverseitigen Constraints aus
// supabase/migrations/20260804122738_reviews.sql (dort verbindlich durchgesetzt; hier nur schnelles
// Feedback vor dem Request, siehe docs/Architecture.md Kapitel 17: „Das Frontend entscheidet niemals
// über Berechtigungen"). Die eigentliche Existenzprüfung der Zielressource übernimmt der
// Datenbank-Trigger `validate_review_target()`.
const REVIEW_TARGET_TYPES: readonly ReviewTargetType[] = ['location', 'artist'];

export function isValidReviewTargetType(value: string): value is ReviewTargetType {
  return (REVIEW_TARGET_TYPES as readonly string[]).includes(value);
}

export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function validateCreateReviewInput(input: CreateReviewInput): string[] {
  const errors: string[] = [];

  if (!isValidReviewTargetType(input.targetType)) {
    errors.push('Bewertungen sind nur für Locations oder Artists möglich.');
  }

  if (!isValidRating(input.rating)) {
    errors.push('Die Bewertung muss zwischen 1 und 5 Sternen liegen.');
  }

  return errors;
}
