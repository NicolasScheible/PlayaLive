import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useArtistFavorite } from './useArtistFavorite';

const mockGetFavorites = jest.fn();
const mockToggleFavorite = jest.fn();

jest.mock('../../../services/FavoriteService', () => ({
  FavoriteService: {
    getFavorites: (...args: unknown[]) => mockGetFavorites(...args),
    toggleFavorite: (...args: unknown[]) => mockToggleFavorite(...args),
  },
}));

describe('useArtistFavorite', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('erkennt einen bereits favorisierten Künstler', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'artist', target_id: 'artist-1', created_at: '' },
    ]);

    const { result } = renderHook(() => useArtistFavorite('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFavorited).toBe(true);
    expect(mockGetFavorites).toHaveBeenCalledWith('artist');
  });

  it('erkennt einen nicht favorisierten Künstler', async () => {
    mockGetFavorites.mockResolvedValue([]);

    const { result } = renderHook(() => useArtistFavorite('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isFavorited).toBe(false);
  });

  it('toggleFavorite ruft FavoriteService.toggleFavorite auf', async () => {
    mockGetFavorites.mockResolvedValue([]);
    mockToggleFavorite.mockResolvedValue(true);

    const { result } = renderHook(() => useArtistFavorite('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.toggleFavorite();
      await waitFor(() => expect(mockToggleFavorite).toHaveBeenCalledWith('artist', 'artist-1'));
    });
  });
});
