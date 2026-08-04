import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useTodayHighlights } from './useTodayHighlights';

const mockGetUpcomingEvents = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/EventService', () => ({
  EventService: { getUpcomingEvents: (...args: unknown[]) => mockGetUpcomingEvents(...args) },
}));

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useTodayHighlights', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('filtert nach dem heutigen Datum und reichert Events mit dem Location-Namen an', async () => {
    mockGetUpcomingEvents.mockResolvedValue([
      { id: 'event-1', location_id: 'loc-1', title: 'Opening Party' },
    ]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useTodayHighlights(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetUpcomingEvents).toHaveBeenCalledWith(
      expect.objectContaining({ from: expect.any(String), to: expect.any(String) }),
    );
    expect(result.current.events).toEqual([
      { id: 'event-1', location_id: 'loc-1', title: 'Opening Party', locationName: 'Test Club' },
    ]);
  });

  it('fällt auf "Unbekannte Location" zurück, wenn die Location fehlt', async () => {
    mockGetUpcomingEvents.mockResolvedValue([
      { id: 'event-1', location_id: 'loc-missing', title: 'Opening Party' },
    ]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useTodayHighlights(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.events[0].locationName).toBe('Unbekannte Location');
  });
});
