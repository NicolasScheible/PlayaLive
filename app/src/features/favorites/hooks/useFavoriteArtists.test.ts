import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useFavoriteArtists } from './useFavoriteArtists';

const mockGetFavorites = jest.fn();
const mockGetArtists = jest.fn();

jest.mock('../../../services/FavoriteService', () => ({
  FavoriteService: { getFavorites: (...args: unknown[]) => mockGetFavorites(...args) },
}));
jest.mock('../../../services/ArtistService', () => ({
  ArtistService: { getArtists: (...args: unknown[]) => mockGetArtists(...args) },
}));

describe('useFavoriteArtists', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert die favorisierten Artists', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'artist', target_id: 'artist-1', created_at: '' },
    ]);
    mockGetArtists.mockResolvedValue([{ id: 'artist-1', name: 'DJ Test' }]);

    const { result } = renderHook(() => useFavoriteArtists(true), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([{ id: 'artist-1', name: 'DJ Test' }]);
    expect(mockGetFavorites).toHaveBeenCalledWith('artist');
  });

  it('lädt nicht, solange enabled=false ist', () => {
    renderHook(() => useFavoriteArtists(false), { wrapper: createQueryWrapper() });

    expect(mockGetFavorites).not.toHaveBeenCalled();
    expect(mockGetArtists).not.toHaveBeenCalled();
  });
});
