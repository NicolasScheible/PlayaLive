import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useFavoritesCount } from './useFavoritesCount';

const mockGetFavorites = jest.fn();

jest.mock('../../../services/FavoriteService', () => ({
  FavoriteService: { getFavorites: (...args: unknown[]) => mockGetFavorites(...args) },
}));

describe('useFavoritesCount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('zählt alle Favoriten unabhängig vom Typ', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', target_type: 'location' },
      { id: 'fav-2', target_type: 'event' },
      { id: 'fav-3', target_type: 'artist' },
    ]);

    const { result } = renderHook(() => useFavoritesCount(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.count).toBe(3);
    expect(mockGetFavorites).toHaveBeenCalledWith();
  });
});
