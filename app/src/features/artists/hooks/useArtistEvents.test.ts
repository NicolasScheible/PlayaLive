import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useArtistEvents } from './useArtistEvents';

const mockGetArtistEvents = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/ArtistService', () => ({
  ArtistService: { getArtistEvents: (...args: unknown[]) => mockGetArtistEvents(...args) },
}));

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useArtistEvents', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('löst Location-Namen auf und teilt in kommende Events und aktuellen Auftritt auf', async () => {
    const now = Date.now();
    const pastEvent = {
      id: 'ev-past',
      location_id: 'loc-1',
      start_time: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    };
    const currentEvent = {
      id: 'ev-current',
      location_id: 'loc-1',
      start_time: new Date(now - 30 * 60 * 1000).toISOString(),
      end_time: new Date(now + 30 * 60 * 1000).toISOString(),
    };
    const futureEvent = {
      id: 'ev-future',
      location_id: 'loc-2',
      start_time: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
      end_time: null,
    };

    mockGetArtistEvents.mockResolvedValue([pastEvent, currentEvent, futureEvent]);
    mockGetLocations.mockResolvedValue([
      { id: 'loc-1', name: 'Test Club' },
      { id: 'loc-2', name: 'Beach Bar' },
    ]);

    const { result } = renderHook(() => useArtistEvents('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.currentEvent?.id).toBe('ev-current');
    expect(result.current.currentEvent?.locationName).toBe('Test Club');
    expect(result.current.upcomingEvents).toHaveLength(1);
    expect(result.current.upcomingEvents[0]?.id).toBe('ev-future');
    expect(result.current.upcomingEvents[0]?.locationName).toBe('Beach Bar');
    expect(mockGetArtistEvents).toHaveBeenCalledWith('artist-1');
  });

  it('liefert currentEvent=null ohne aktuell laufendes Event', async () => {
    mockGetArtistEvents.mockResolvedValue([]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useArtistEvents('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.currentEvent).toBeNull();
    expect(result.current.upcomingEvents).toEqual([]);
  });

  it('nutzt einen Platzhalternamen für unbekannte Locations', async () => {
    mockGetArtistEvents.mockResolvedValue([
      {
        id: 'ev-future',
        location_id: 'loc-unknown',
        start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        end_time: null,
      },
    ]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useArtistEvents('artist-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.upcomingEvents[0]?.locationName).toBe('Unbekannte Location');
  });
});
