import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useFavoriteLocations } from './useFavoriteLocations';

const mockGetFavorites = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/FavoriteService', () => ({
  FavoriteService: { getFavorites: (...args: unknown[]) => mockGetFavorites(...args) },
}));
jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useFavoriteLocations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert die favorisierten Locations', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'location', target_id: 'loc-1', created_at: '' },
    ]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useFavoriteLocations(true), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([{ id: 'loc-1', name: 'Test Club' }]);
    expect(mockGetFavorites).toHaveBeenCalledWith('location');
  });

  it('lädt nicht, solange enabled=false ist', () => {
    renderHook(() => useFavoriteLocations(false), { wrapper: createQueryWrapper() });

    expect(mockGetFavorites).not.toHaveBeenCalled();
    expect(mockGetLocations).not.toHaveBeenCalled();
  });
});
