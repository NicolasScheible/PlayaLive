import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useLocationTodayEvents } from './useLocationTodayEvents';

const mockGetUpcomingEvents = jest.fn();

jest.mock('../../../services/EventService', () => ({
  EventService: { getUpcomingEvents: (...args: unknown[]) => mockGetUpcomingEvents(...args) },
}));

describe('useLocationTodayEvents', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fragt Events für den heutigen Tag dieser Location ab', async () => {
    mockGetUpcomingEvents.mockResolvedValue([]);

    renderHook(() => useLocationTodayEvents('loc-1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockGetUpcomingEvents).toHaveBeenCalledTimes(1));

    const [filters] = mockGetUpcomingEvents.mock.calls[0];
    expect(filters.locationId).toBe('loc-1');
    expect(new Date(filters.from).getHours()).toBe(0);
    expect(new Date(filters.to).getHours()).toBe(23);
  });

  it('markiert aktuell laufende Events als isLive', async () => {
    const now = Date.now();
    mockGetUpcomingEvents.mockResolvedValue([
      {
        id: 'ev-running',
        start_time: new Date(now - 60 * 60 * 1000).toISOString(),
        end_time: new Date(now + 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'ev-future',
        start_time: new Date(now + 60 * 60 * 1000).toISOString(),
        end_time: null,
      },
    ]);

    const { result } = renderHook(() => useLocationTodayEvents('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.events.find((event) => event.id === 'ev-running')?.isLive).toBe(true);
    expect(result.current.events.find((event) => event.id === 'ev-future')?.isLive).toBe(false);
  });
});
