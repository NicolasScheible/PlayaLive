import { ReviewRepository } from './ReviewRepository';

const mockFrom = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

function createBuilder(result: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  ['select', 'insert', 'update', 'eq', 'is', 'order'].forEach((method) => {
    builder[method] = jest.fn(() => builder);
  });
  builder.single = jest.fn().mockResolvedValue(result);
  builder.maybeSingle = jest.fn().mockResolvedValue(result);
  builder.then = (resolve: (value: typeof result) => unknown) =>
    Promise.resolve(result).then(resolve);

  return builder;
}

describe('ReviewRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('insertReview gibt die eingefügte Zeile zurück', async () => {
    const row = { id: 'review-1', target_type: 'location', target_id: 'loc-1', rating: 5 };
    mockFrom.mockReturnValue(createBuilder({ data: row, error: null }));

    const result = await ReviewRepository.insertReview({
      user_id: 'user-1',
      target_type: 'location',
      target_id: 'loc-1',
      rating: 5,
    });

    expect(mockFrom).toHaveBeenCalledWith('reviews');
    expect(result).toEqual(row);
  });

  it('insertReview wirft den rohen Postgrest-Fehler unverändert (Mapping übernimmt der Service)', async () => {
    const rawError = { message: 'REVIEW_INVALID_TARGET: ...', code: 'P0001' };
    mockFrom.mockReturnValue(createBuilder({ data: null, error: rawError }));

    await expect(
      ReviewRepository.insertReview({
        user_id: 'user-1',
        target_type: 'location',
        target_id: 'loc-1',
        rating: 5,
      }),
    ).rejects.toBe(rawError);
  });

  it('updateReview aktualisiert die angegebene Review', async () => {
    const row = { id: 'review-1', rating: 3 };
    const builder = createBuilder({ data: row, error: null });
    mockFrom.mockReturnValue(builder);

    const result = await ReviewRepository.updateReview('review-1', { rating: 3 });

    expect(builder.update).toHaveBeenCalledWith({ rating: 3 });
    expect(builder.eq).toHaveBeenCalledWith('id', 'review-1');
    expect(result).toEqual(row);
  });

  it('findByTarget liest nicht-gelöschte Reviews zu einem Ziel, neueste zuerst', async () => {
    const reviews = [{ id: 'review-1' }];
    const builder = createBuilder({ data: reviews, error: null });
    mockFrom.mockReturnValue(builder);

    const result = await ReviewRepository.findByTarget({
      targetType: 'location',
      targetId: 'loc-1',
    });

    expect(builder.eq).toHaveBeenCalledWith('target_type', 'location');
    expect(builder.eq).toHaveBeenCalledWith('target_id', 'loc-1');
    expect(builder.is).toHaveBeenCalledWith('deleted_at', null);
    expect(builder.order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toEqual(reviews);
  });

  it('insertReviewFlag gibt die eingefügte Zeile zurück', async () => {
    const row = { id: 'flag-1', review_id: 'review-1' };
    mockFrom.mockReturnValue(createBuilder({ data: row, error: null }));

    const result = await ReviewRepository.insertReviewFlag({
      review_id: 'review-1',
      flagged_by_user_id: 'user-2',
      reason: 'Spam',
    });

    expect(mockFrom).toHaveBeenCalledWith('review_flags');
    expect(result).toEqual(row);
  });
});
