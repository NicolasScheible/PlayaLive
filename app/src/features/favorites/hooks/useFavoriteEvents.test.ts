import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useFavoriteEvents } from './useFavoriteEvents';

const mockGetFavorites = jest.fn();
const mockGetUpcomingEvents = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/FavoriteService', () => ({
  FavoriteService: { getFavorites: (...args: unknown[]) => mockGetFavorites(...args) },
}));
jest.mock('../../../services/EventService', () => ({
  EventService: { getUpcomingEvents: (...args: unknown[]) => mockGetUpcomingEvents(...args) },
}));
jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

const event = {
  id: 'ev-1',
  location_id: 'loc-1',
  title: 'Closing Party',
  description: null,
  start_time: new Date().toISOString(),
  end_time: null,
  image_url: null,
  is_sponsored: false,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

describe('useFavoriteEvents', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert die favorisierten Events inklusive Location-Namen', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'event', target_id: 'ev-1', created_at: '' },
    ]);
    mockGetUpcomingEvents.mockResolvedValue([event]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useFavoriteEvents(true), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([{ ...event, locationName: 'Test Club' }]);
    expect(mockGetFavorites).toHaveBeenCalledWith('event');
  });

  it('nutzt einen Platzhalter-Namen, wenn die Location nicht gefunden wird', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'event', target_id: 'ev-1', created_at: '' },
    ]);
    mockGetUpcomingEvents.mockResolvedValue([event]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useFavoriteEvents(true), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items[0].locationName).toBe('Unbekannte Location');
  });

  it('lädt nicht, solange enabled=false ist', () => {
    renderHook(() => useFavoriteEvents(false), { wrapper: createQueryWrapper() });

    expect(mockGetFavorites).not.toHaveBeenCalled();
    expect(mockGetUpcomingEvents).not.toHaveBeenCalled();
    expect(mockGetLocations).not.toHaveBeenCalled();
  });
});
