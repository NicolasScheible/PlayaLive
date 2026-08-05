import { renderHook } from '@testing-library/react-native';

import { useEventDetailScreen } from './useEventDetailScreen';

const mockUseEventDetail = jest.fn();
const liveStatusResult = { liveStatus: null, isLoading: false, isError: false, error: null };
const mockUseEventLocationLiveStatus = jest.fn((_locationId: string | null) => liveStatusResult);
const happyHoursResult = {
  happyHours: [] as unknown[],
  isLoading: false,
  isError: false,
  error: null,
};
const mockUseEventLocationHappyHours = jest.fn((_locationId: string | null) => happyHoursResult);
const specialsResult = { specials: [] as unknown[], isLoading: false, isError: false, error: null };
const mockUseEventLocationSpecials = jest.fn((_locationId: string | null) => specialsResult);
const favoriteResult = {
  isFavorited: false,
  toggleFavorite: jest.fn(),
  isLoading: false,
  isToggling: false,
  error: null,
};
const mockUseEventFavorite = jest.fn(() => favoriteResult);

type MockUserLocationResult = {
  status: 'undetermined' | 'granted' | 'denied';
  coords: { latitude: number; longitude: number } | null;
  isLoading: boolean;
  requestPermission: () => Promise<'undetermined' | 'granted' | 'denied'>;
};
const mockUseUserLocation = jest.fn((): MockUserLocationResult => ({
  status: 'undetermined',
  coords: null,
  isLoading: false,
  requestPermission: jest.fn(),
}));

jest.mock('./useEventDetail', () => ({ useEventDetail: (id: string) => mockUseEventDetail(id) }));
jest.mock('./useEventLocationLiveStatus', () => ({
  useEventLocationLiveStatus: (locationId: string | null) =>
    mockUseEventLocationLiveStatus(locationId),
}));
jest.mock('./useEventLocationHappyHours', () => ({
  useEventLocationHappyHours: (locationId: string | null) =>
    mockUseEventLocationHappyHours(locationId),
}));
jest.mock('./useEventLocationSpecials', () => ({
  useEventLocationSpecials: (locationId: string | null) => mockUseEventLocationSpecials(locationId),
}));
jest.mock('./useEventFavorite', () => ({ useEventFavorite: () => mockUseEventFavorite() }));
jest.mock('../../../hooks/useUserLocation', () => ({
  useUserLocation: () => mockUseUserLocation(),
}));

const event = {
  id: 'ev-1',
  title: 'Opening Party',
  location: { id: 'loc-1', latitude: 39.5, longitude: 2.6 },
  artists: [],
};

describe('useEventDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEventDetail.mockReturnValue({
      event,
      isLoading: false,
      isError: false,
      error: null,
      notFound: false,
    });
    mockUseUserLocation.mockReturnValue({
      status: 'undetermined',
      coords: null,
      isLoading: false,
      requestPermission: jest.fn(),
    });
  });

  it('bündelt Event-Grunddaten und alle Sektionen, mit der Location-ID des Events', () => {
    const { result } = renderHook(() => useEventDetailScreen('ev-1'));

    expect(mockUseEventDetail).toHaveBeenCalledWith('ev-1');
    expect(mockUseEventLocationLiveStatus).toHaveBeenCalledWith('loc-1');
    expect(mockUseEventLocationHappyHours).toHaveBeenCalledWith('loc-1');
    expect(mockUseEventLocationSpecials).toHaveBeenCalledWith('loc-1');
    expect(result.current.event).toEqual(event);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.notFound).toBe(false);
    expect(result.current.liveStatus).toEqual(liveStatusResult);
    expect(result.current.happyHours).toEqual(happyHoursResult);
    expect(result.current.specials).toEqual(specialsResult);
    expect(result.current.favorite).toEqual(favoriteResult);
  });

  it('übergibt null als Location-ID, solange das Event noch nicht geladen ist', () => {
    mockUseEventDetail.mockReturnValue({
      event: null,
      isLoading: true,
      isError: false,
      error: null,
      notFound: false,
    });

    renderHook(() => useEventDetailScreen('ev-1'));

    expect(mockUseEventLocationLiveStatus).toHaveBeenCalledWith(null);
  });

  it('berechnet die Distanz, wenn ein Nutzerstandort vorliegt', () => {
    mockUseUserLocation.mockReturnValue({
      status: 'granted',
      coords: { latitude: 39.5, longitude: 2.6 },
      isLoading: false,
      requestPermission: jest.fn(),
    });

    const { result } = renderHook(() => useEventDetailScreen('ev-1'));

    expect(result.current.distanceMeters).toBe(0);
  });

  it('liefert distanceMeters=null ohne Nutzerstandort', () => {
    const { result } = renderHook(() => useEventDetailScreen('ev-1'));

    expect(result.current.distanceMeters).toBeNull();
  });
});
