import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useArtistDetail } from './useArtistDetail';

const mockGetArtistById = jest.fn();

jest.mock('../../../services/ArtistService', () => ({
  ArtistService: { getArtistById: (...args: unknown[]) => mockGetArtistById(...args) },
}));

describe('useArtistDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert den Künstler vom ArtistService', async () => {
    const artist = { id: 'artist-1', name: 'DJ Test' };
    mockGetArtistById.mockResolvedValue(artist);

    const { result } = renderHook(() => useArtistDetail('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.artist).toEqual(artist);
    expect(result.current.notFound).toBe(false);
    expect(mockGetArtistById).toHaveBeenCalledWith('artist-1');
  });

  it('markiert notFound, wenn kein Künstler gefunden wurde', async () => {
    mockGetArtistById.mockResolvedValue(null);

    const { result } = renderHook(() => useArtistDetail('artist-missing'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.artist).toBeNull();
    expect(result.current.notFound).toBe(true);
  });

  it('markiert isError bei einem Ladefehler, nicht notFound', async () => {
    mockGetArtistById.mockRejectedValue({
      code: 'SERVER_ERROR',
      messageKey: 'errors.database.SERVER_ERROR',
      message: 'Fehler',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useArtistDetail('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.notFound).toBe(false);
  });
});
