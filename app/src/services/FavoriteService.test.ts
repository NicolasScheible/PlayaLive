import { FavoriteService } from './FavoriteService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();
const mockGetSession = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

jest.mock('./AuthService', () => ({
  AuthService: { getSession: (...args: unknown[]) => mockGetSession(...args) },
}));

const session = { user: { id: 'user-1' } };

describe('FavoriteService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('wirft AUTH_SESSION_MISSING ohne aktive Session', async () => {
    mockGetSession.mockResolvedValue({ session: null });

    await expect(FavoriteService.getFavorites()).rejects.toMatchObject({
      code: 'AUTH_SESSION_MISSING',
    });
  });

  it('addFavorite lehnt einen ungültigen target_type bereits clientseitig ab', async () => {
    mockGetSession.mockResolvedValue({ session });

    await expect(
      FavoriteService.addFavorite({ targetType: 'review' as never, targetId: 'x' }),
    ).rejects.toMatchObject({ code: 'FAVORITE_INVALID_TARGET' });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('addFavorite fügt einen Favoriten für den angemeldeten Nutzer hinzu', async () => {
    mockGetSession.mockResolvedValue({ session });
    const favorite = {
      id: 'fav-1',
      user_id: 'user-1',
      target_type: 'location',
      target_id: 'loc-1',
    };
    const builder = createQueryBuilderMock({ data: favorite, error: null });
    mockFrom.mockReturnValue(builder);

    const result = await FavoriteService.addFavorite({ targetType: 'location', targetId: 'loc-1' });

    expect(builder.insert).toHaveBeenCalledWith({
      user_id: 'user-1',
      target_type: 'location',
      target_id: 'loc-1',
    });
    expect(result).toEqual(favorite);
  });

  it('getFavorites filtert nach dem angemeldeten Nutzer', async () => {
    mockGetSession.mockResolvedValue({ session });
    const builder = createQueryBuilderMock({ data: [], error: null });
    mockFrom.mockReturnValue(builder);

    await FavoriteService.getFavorites('location');

    expect(builder.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(builder.eq).toHaveBeenCalledWith('target_type', 'location');
  });

  describe('toggleFavorite', () => {
    it('entfernt einen bestehenden Favoriten', async () => {
      mockGetSession.mockResolvedValue({ session });
      const selectBuilder = createQueryBuilderMock({ data: { id: 'fav-1' }, error: null });
      const deleteBuilder = createQueryBuilderMock({ data: null, error: null });
      mockFrom.mockReturnValueOnce(selectBuilder).mockReturnValueOnce(deleteBuilder);

      const result = await FavoriteService.toggleFavorite('location', 'loc-1');

      expect(deleteBuilder.delete).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('fügt einen neuen Favoriten hinzu, wenn noch keiner existiert', async () => {
      mockGetSession.mockResolvedValue({ session });
      const selectBuilder = createQueryBuilderMock({ data: null, error: null });
      const insertBuilder = createQueryBuilderMock({
        data: { id: 'fav-1', user_id: 'user-1', target_type: 'location', target_id: 'loc-1' },
        error: null,
      });
      mockFrom.mockReturnValueOnce(selectBuilder).mockReturnValueOnce(insertBuilder);

      const result = await FavoriteService.toggleFavorite('location', 'loc-1');

      expect(insertBuilder.insert).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
