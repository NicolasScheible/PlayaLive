import { renderHook } from '@testing-library/react-native';

import { useArtistDetailScreen } from './useArtistDetailScreen';

const artist = { id: 'artist-1', name: 'DJ Test' };
const mockUseArtistDetail = jest.fn((_id: string) => ({
  artist,
  isLoading: false,
  isError: false,
  error: null,
  notFound: false,
}));
const eventsResult = {
  upcomingEvents: [] as unknown[],
  currentEvent: null as { id: string } | null,
  isLoading: false,
  isError: false,
  error: null,
};
const mockUseArtistEvents = jest.fn((_id: string) => eventsResult);
const currentEventDetailResult = {
  eventDetail: null,
  isLoading: false,
  isError: false,
  error: null,
};
const mockUseArtistCurrentEventDetail = jest.fn(
  (_currentEventId: string | null) => currentEventDetailResult,
);
const favoriteResult = {
  isFavorited: false,
  toggleFavorite: jest.fn(),
  isLoading: false,
  isToggling: false,
  error: null,
};
const mockUseArtistFavorite = jest.fn(() => favoriteResult);

jest.mock('./useArtistDetail', () => ({
  useArtistDetail: (id: string) => mockUseArtistDetail(id),
}));
jest.mock('./useArtistEvents', () => ({
  useArtistEvents: (id: string) => mockUseArtistEvents(id),
}));
jest.mock('./useArtistCurrentEventDetail', () => ({
  useArtistCurrentEventDetail: (currentEventId: string | null) =>
    mockUseArtistCurrentEventDetail(currentEventId),
}));
jest.mock('./useArtistFavorite', () => ({ useArtistFavorite: () => mockUseArtistFavorite() }));

describe('useArtistDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseArtistDetail.mockReturnValue({
      artist,
      isLoading: false,
      isError: false,
      error: null,
      notFound: false,
    });
    mockUseArtistEvents.mockReturnValue(eventsResult);
  });

  it('bündelt Künstler-Grunddaten, Events und Favoriten-Status', () => {
    const { result } = renderHook(() => useArtistDetailScreen('artist-1'));

    expect(mockUseArtistDetail).toHaveBeenCalledWith('artist-1');
    expect(mockUseArtistEvents).toHaveBeenCalledWith('artist-1');
    expect(result.current.artist).toEqual(artist);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.notFound).toBe(false);
    expect(result.current.upcomingEvents).toEqual([]);
    expect(result.current.currentEventDetail).toEqual(currentEventDetailResult);
    expect(result.current.favorite).toEqual(favoriteResult);
  });

  it('übergibt die ID des aktuell laufenden Events an useArtistCurrentEventDetail', () => {
    mockUseArtistEvents.mockReturnValue({ ...eventsResult, currentEvent: { id: 'ev-current' } });

    renderHook(() => useArtistDetailScreen('artist-1'));

    expect(mockUseArtistCurrentEventDetail).toHaveBeenCalledWith('ev-current');
  });

  it('übergibt null, solange kein Event aktuell läuft', () => {
    renderHook(() => useArtistDetailScreen('artist-1'));

    expect(mockUseArtistCurrentEventDetail).toHaveBeenCalledWith(null);
  });
});
