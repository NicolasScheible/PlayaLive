import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useNextAct } from './useNextAct';

const mockGetUpcomingEvents = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/EventService', () => ({
  EventService: { getUpcomingEvents: (...args: unknown[]) => mockGetUpcomingEvents(...args) },
}));

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useNextAct', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('nimmt das erste kommende Event und reichert es mit dem Location-Namen an', async () => {
    mockGetUpcomingEvents.mockResolvedValue([
      { id: 'event-1', location_id: 'loc-1', title: 'Next Party' },
      { id: 'event-2', location_id: 'loc-1', title: 'Later Party' },
    ]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useNextAct(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.nextAct).toEqual({
      id: 'event-1',
      location_id: 'loc-1',
      title: 'Next Party',
      locationName: 'Test Club',
    });
  });

  it('liefert nextAct = null, wenn kein Event ansteht', async () => {
    mockGetUpcomingEvents.mockResolvedValue([]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useNextAct(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.nextAct).toBeNull();
  });

  it('stößt über retry() Events- und Locations-Query erneut an', async () => {
    mockGetUpcomingEvents.mockResolvedValue([]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useNextAct(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetUpcomingEvents).toHaveBeenCalledTimes(1);

    result.current.retry();

    await waitFor(() => expect(mockGetUpcomingEvents).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(mockGetLocations).toHaveBeenCalledTimes(2));
  });
});
