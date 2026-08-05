import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useGlobalSearch } from './useGlobalSearch';

const mockGetLocations = jest.fn();
const mockGetUpcomingEvents = jest.fn();
const mockGetArtists = jest.fn();

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));
jest.mock('../../../services/EventService', () => ({
  EventService: { getUpcomingEvents: (...args: unknown[]) => mockGetUpcomingEvents(...args) },
}));
jest.mock('../../../services/ArtistService', () => ({
  ArtistService: { getArtists: (...args: unknown[]) => mockGetArtists(...args) },
}));

const locations = [
  { id: 'loc-1', name: 'Beach Club Ballermann' },
  { id: 'loc-2', name: 'Sunset Bar' },
];
const events = [
  { id: 'ev-1', title: 'Ballermann Opening Party', start_time: '2026-08-05T20:00:00.000Z' },
  { id: 'ev-2', title: 'Sunset Sessions', start_time: '2026-08-06T18:00:00.000Z' },
];
const artists = [
  { id: 'artist-1', name: 'DJ Ballermann', genres: ['House'] },
  { id: 'artist-2', name: 'DJ Sunset', genres: [] },
];

describe('useGlobalSearch', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetLocations.mockResolvedValue(locations);
    mockGetUpcomingEvents.mockResolvedValue(events);
    mockGetArtists.mockResolvedValue(artists);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('löst bei leerem Suchtext keine Requests aus und liefert leere Ergebnislisten', () => {
    const { result } = renderHook(() => useGlobalSearch(), { wrapper: createQueryWrapper() });

    expect(result.current.isQueryPresent).toBe(false);
    expect(result.current.locations).toEqual([]);
    expect(result.current.events).toEqual([]);
    expect(result.current.artists).toEqual([]);
    expect(mockGetLocations).not.toHaveBeenCalled();
    expect(mockGetUpcomingEvents).not.toHaveBeenCalled();
    expect(mockGetArtists).not.toHaveBeenCalled();
  });

  it('sucht erst nach Ablauf des Debounce über alle drei Entitäten (case-insensitive)', async () => {
    const { result } = renderHook(() => useGlobalSearch(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.setQuery('ballermann');
    });

    expect(mockGetLocations).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetLocations).toHaveBeenCalledTimes(1);
    expect(mockGetUpcomingEvents).toHaveBeenCalledTimes(1);
    expect(mockGetArtists).toHaveBeenCalledTimes(1);
    expect(result.current.locations).toEqual([locations[0]]);
    expect(result.current.events).toEqual([events[0]]);
    expect(result.current.artists).toEqual([artists[0]]);
  });

  it('meldet isEmpty, wenn kein Treffer über alle drei Entitäten gefunden wird', async () => {
    const { result } = renderHook(() => useGlobalSearch(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.setQuery('nichts-vorhanden');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isEmpty).toBe(true);
  });

  it('meldet einen Fehler, wenn ein Service fehlschlägt', async () => {
    mockGetLocations.mockRejectedValue({
      code: 'SERVER_ERROR',
      messageKey: 'x',
      message: 'Der Server ist aktuell nicht erreichbar. Bitte versuche es später erneut.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useGlobalSearch(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.setQuery('sunset');
    });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.code).toBe('SERVER_ERROR');
  });
});
