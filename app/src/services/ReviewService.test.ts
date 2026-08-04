import { ReviewService } from './ReviewService';

const mockGetSession = jest.fn();
const mockInsertReview = jest.fn();
const mockUpdateReview = jest.fn();
const mockFindByTarget = jest.fn();
const mockInsertReviewFlag = jest.fn();

jest.mock('./AuthService', () => ({
  AuthService: { getSession: (...args: unknown[]) => mockGetSession(...args) },
}));

jest.mock('../repositories/ReviewRepository', () => ({
  ReviewRepository: {
    insertReview: (...args: unknown[]) => mockInsertReview(...args),
    updateReview: (...args: unknown[]) => mockUpdateReview(...args),
    findByTarget: (...args: unknown[]) => mockFindByTarget(...args),
    insertReviewFlag: (...args: unknown[]) => mockInsertReviewFlag(...args),
  },
}));

const session = { user: { id: 'user-1' } };
const validInput = { targetType: 'location' as const, targetId: 'loc-1', rating: 5 };

describe('ReviewService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    it('lehnt ungültige Eingaben ab, ohne das Repository aufzurufen', async () => {
      mockGetSession.mockResolvedValue({ session });

      await expect(ReviewService.createReview({ ...validInput, rating: 9 })).rejects.toMatchObject({
        code: 'VALIDATION_ERROR',
      });
      expect(mockInsertReview).not.toHaveBeenCalled();
    });

    it('wirft AUTH_SESSION_MISSING ohne aktive Session', async () => {
      mockGetSession.mockResolvedValue({ session: null });

      await expect(ReviewService.createReview(validInput)).rejects.toMatchObject({
        code: 'AUTH_SESSION_MISSING',
      });
    });

    it('ruft das Repository mit der Nutzer-ID aus der Session auf', async () => {
      mockGetSession.mockResolvedValue({ session });
      const review = { id: 'review-1', ...validInput };
      mockInsertReview.mockResolvedValue(review);

      const result = await ReviewService.createReview(validInput);

      expect(mockInsertReview).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'user-1', target_type: 'location', target_id: 'loc-1' }),
      );
      expect(result).toEqual(review);
    });

    it('übersetzt einen REVIEW_INVALID_TARGET-Fehler aus dem Repository', async () => {
      mockGetSession.mockResolvedValue({ session });
      mockInsertReview.mockRejectedValue({ message: 'REVIEW_INVALID_TARGET: ...', code: 'P0001' });

      await expect(ReviewService.createReview(validInput)).rejects.toMatchObject({
        code: 'REVIEW_INVALID_TARGET',
      });
    });
  });

  describe('updateReview', () => {
    it('lehnt eine ungültige Bewertung ab, ohne das Repository aufzurufen', async () => {
      await expect(ReviewService.updateReview('review-1', { rating: 0 })).rejects.toMatchObject({
        code: 'VALIDATION_ERROR',
      });
      expect(mockUpdateReview).not.toHaveBeenCalled();
    });

    it('aktualisiert nur die übergebenen Felder', async () => {
      mockUpdateReview.mockResolvedValue({ id: 'review-1', rating: 3 });

      await ReviewService.updateReview('review-1', { rating: 3 });

      expect(mockUpdateReview).toHaveBeenCalledWith('review-1', { rating: 3 });
    });

    it('übersetzt eine fehlende/fremde Review als REVIEW_NOT_FOUND', async () => {
      mockUpdateReview.mockRejectedValue({ code: 'PGRST116', message: 'no rows' });

      await expect(ReviewService.updateReview('review-1', { rating: 4 })).rejects.toMatchObject({
        code: 'REVIEW_NOT_FOUND',
      });
    });
  });

  describe('deleteReview', () => {
    it('setzt deleted_at über das Repository (Soft Delete)', async () => {
      mockUpdateReview.mockResolvedValue({
        id: 'review-1',
        deleted_at: '2026-08-04T00:00:00.000Z',
      });

      await ReviewService.deleteReview('review-1');

      expect(mockUpdateReview).toHaveBeenCalledWith(
        'review-1',
        expect.objectContaining({ deleted_at: expect.any(String) }),
      );
    });
  });

  describe('getReviews', () => {
    it('liest Reviews ohne Session-Pflicht', async () => {
      const reviews = [{ id: 'review-1' }];
      mockFindByTarget.mockResolvedValue(reviews);

      const result = await ReviewService.getReviews({ targetType: 'location', targetId: 'loc-1' });

      expect(mockGetSession).not.toHaveBeenCalled();
      expect(result).toEqual(reviews);
    });
  });

  describe('flagReview', () => {
    it('meldet eine Review mit der Nutzer-ID aus der Session', async () => {
      mockGetSession.mockResolvedValue({ session });
      mockInsertReviewFlag.mockResolvedValue({ id: 'flag-1' });

      await ReviewService.flagReview({ reviewId: 'review-1', reason: 'Spam' });

      expect(mockInsertReviewFlag).toHaveBeenCalledWith({
        review_id: 'review-1',
        flagged_by_user_id: 'user-1',
        reason: 'Spam',
      });
    });
  });
});
