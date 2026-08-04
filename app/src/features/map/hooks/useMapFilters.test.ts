import { renderHook, waitFor } from '@testing-library/react-native';

import { useFilterStore } from '../../../store/filterStore';
import type { LocationWithLiveStatus } from '../../../types/entities';

import { createQueryWrapper } from './testUtils';
import { useMapFilters } from './useMapFilters';

const mockGetFavorites = jest.fn();
const mockIsOpenNow = jest.fn();

jest.mock('../../../services/FavoriteService', () => ({
  FavoriteService: { getFavorites: (...args: unknown[]) => mockGetFavorites(...args) },
}));

jest.mock('../../../utils/isOpenNow', () => ({
  isOpenNow: (...args: unknown[]) => mockIsOpenNow(...args),
}));

const club: LocationWithLiveStatus = {
  id: 'loc-club',
  name: 'Club',
  description: null,
  category: 'club',
  address: null,
  latitude: 39.5,
  longitude: 2.6,
  opening_hours: null,
  images: [],
  is_sponsored: false,
  sponsored_until: null,
  owner_user_id: null,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  liveStatus: {
    location_id: 'loc-club',
    occupancy_level: 'high',
    report_count: 1,
    is_confident: true,
    wait_time_minutes: null,
    last_reported_at: null,
  },
};

const bar: LocationWithLiveStatus = {
  ...club,
  id: 'loc-bar',
  name: 'Bar',
  category: 'bar',
  liveStatus: { ...club.liveStatus!, location_id: 'loc-bar', occupancy_level: 'low' },
};

describe('useMapFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFilterStore.setState({
      category: null,
      occupancyLevel: null,
      openNow: false,
      favoritesOnly: false,
    });
    mockIsOpenNow.mockReturnValue(true);
  });

  it('liefert alle Locations ohne aktive Filter', () => {
    const { result } = renderHook(() => useMapFilters([club, bar]), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.filteredLocations).toEqual([club, bar]);
  });

  it('filtert nach Kategorie', () => {
    useFilterStore.getState().setCategory('bar');

    const { result } = renderHook(() => useMapFilters([club, bar]), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.filteredLocations).toEqual([bar]);
  });

  it('filtert nach Auslastung', () => {
    useFilterStore.getState().setOccupancyLevel('low');

    const { result } = renderHook(() => useMapFilters([club, bar]), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.filteredLocations).toEqual([bar]);
  });

  it('filtert nach „geöffnet"', () => {
    useFilterStore.getState().setOpenNow(true);
    mockIsOpenNow.mockImplementation((openingHours: unknown) => openingHours === null);

    const { result } = renderHook(() => useMapFilters([club, bar]), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.filteredLocations).toEqual([club, bar]);
    expect(mockIsOpenNow).toHaveBeenCalledWith(club.opening_hours);
  });

  it('filtert nach Favoriten', async () => {
    useFilterStore.getState().setFavoritesOnly(true);
    mockGetFavorites.mockResolvedValue([
      {
        id: 'fav-1',
        user_id: 'user-1',
        target_type: 'location',
        target_id: 'loc-bar',
        created_at: '',
      },
    ]);

    const { result } = renderHook(() => useMapFilters([club, bar]), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.filteredLocations).toEqual([bar]);
    expect(mockGetFavorites).toHaveBeenCalledWith('location');
  });

  it('ruft FavoriteService nicht auf, wenn der Favoriten-Filter inaktiv ist', () => {
    renderHook(() => useMapFilters([club, bar]), { wrapper: createQueryWrapper() });

    expect(mockGetFavorites).not.toHaveBeenCalled();
  });
});
