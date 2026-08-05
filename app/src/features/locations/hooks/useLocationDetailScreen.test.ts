import { renderHook } from '@testing-library/react-native';

import { useLocationDetailScreen } from './useLocationDetailScreen';

const mockUseLocationDetail = jest.fn();
const mockUseLocationLiveStatus = jest.fn(() => ({
  liveStatus: null,
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseLocationHappyHours = jest.fn(() => ({
  happyHours: [],
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseLocationSpecials = jest.fn(() => ({
  specials: [],
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseLocationTodayEvents = jest.fn(() => ({
  events: [],
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseLocationReviews = jest.fn(() => ({
  reviews: [],
  averageRating: null,
  reviewCount: 0,
  isLoading: false,
  isError: false,
  error: null,
}));
const favoriteResult = {
  isFavorited: false,
  toggleFavorite: jest.fn(),
  isLoading: false,
  isToggling: false,
  error: null,
};
const mockUseLocationFavorite = jest.fn(() => favoriteResult);
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

jest.mock('./useLocationDetail', () => ({
  useLocationDetail: (id: string) => mockUseLocationDetail(id),
}));
jest.mock('./useLocationLiveStatus', () => ({
  useLocationLiveStatus: () => mockUseLocationLiveStatus(),
}));
jest.mock('./useLocationHappyHours', () => ({
  useLocationHappyHours: () => mockUseLocationHappyHours(),
}));
jest.mock('./useLocationSpecials', () => ({
  useLocationSpecials: () => mockUseLocationSpecials(),
}));
jest.mock('./useLocationTodayEvents', () => ({
  useLocationTodayEvents: () => mockUseLocationTodayEvents(),
}));
jest.mock('./useLocationReviews', () => ({ useLocationReviews: () => mockUseLocationReviews() }));
jest.mock('./useLocationFavorite', () => ({
  useLocationFavorite: () => mockUseLocationFavorite(),
}));
jest.mock('../../../hooks/useUserLocation', () => ({
  useUserLocation: () => mockUseUserLocation(),
}));

const location = {
  id: 'loc-1',
  name: 'Test Club',
  latitude: 39.5,
  longitude: 2.6,
  liveStatus: null,
};

describe('useLocationDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocationDetail.mockReturnValue({
      location,
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

  it('bündelt Grunddaten und alle Sektionen', () => {
    const { result } = renderHook(() => useLocationDetailScreen('loc-1'));

    expect(mockUseLocationDetail).toHaveBeenCalledWith('loc-1');
    expect(result.current.location).toEqual(location);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.notFound).toBe(false);
    expect(result.current.liveStatus).toEqual(mockUseLocationLiveStatus());
    expect(result.current.happyHours).toEqual(mockUseLocationHappyHours());
    expect(result.current.specials).toEqual(mockUseLocationSpecials());
    expect(result.current.todayEvents).toEqual(mockUseLocationTodayEvents());
    expect(result.current.reviews).toEqual(mockUseLocationReviews());
    expect(result.current.favorite).toEqual(favoriteResult);
  });

  it('berechnet die Distanz, wenn ein Nutzerstandort vorliegt', () => {
    mockUseUserLocation.mockReturnValue({
      status: 'granted',
      coords: { latitude: 39.5, longitude: 2.6 },
      isLoading: false,
      requestPermission: jest.fn(),
    });

    const { result } = renderHook(() => useLocationDetailScreen('loc-1'));

    expect(result.current.distanceMeters).toBe(0);
  });

  it('liefert distanceMeters=null ohne Nutzerstandort', () => {
    const { result } = renderHook(() => useLocationDetailScreen('loc-1'));

    expect(result.current.distanceMeters).toBeNull();
  });
});
