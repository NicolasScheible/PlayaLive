import {
  isValidRating,
  isValidReviewTargetType,
  validateCreateReviewInput,
} from './reviewValidation';

describe('reviewValidation', () => {
  describe('isValidReviewTargetType', () => {
    it('akzeptiert location und artist', () => {
      expect(isValidReviewTargetType('location')).toBe(true);
      expect(isValidReviewTargetType('artist')).toBe(true);
    });

    it('lehnt event ab (nur bei Favorites gültig, nicht bei Reviews)', () => {
      expect(isValidReviewTargetType('event')).toBe(false);
    });
  });

  describe('isValidRating', () => {
    it('akzeptiert ganze Zahlen zwischen 1 und 5', () => {
      expect(isValidRating(1)).toBe(true);
      expect(isValidRating(5)).toBe(true);
    });

    it('lehnt Werte außerhalb des Bereichs und Nicht-Ganzzahlen ab', () => {
      expect(isValidRating(0)).toBe(false);
      expect(isValidRating(6)).toBe(false);
      expect(isValidRating(3.5)).toBe(false);
    });
  });

  describe('validateCreateReviewInput', () => {
    it('gibt keine Fehler für gültige Eingaben zurück', () => {
      const errors = validateCreateReviewInput({
        targetType: 'location',
        targetId: 'loc-1',
        rating: 4,
      });

      expect(errors).toEqual([]);
    });

    it('sammelt Fehler für ungültiges targetType und rating', () => {
      const errors = validateCreateReviewInput({
        targetType: 'event' as never,
        targetId: 'x',
        rating: 9,
      });

      expect(errors).toHaveLength(2);
    });
  });
});
