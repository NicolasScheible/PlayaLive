import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useCommunityReportScreen } from './useCommunityReportScreen';

const mockGetLocationById = jest.fn();
const mockGetLiveStatus = jest.fn();
const mockSubscribeToReports = jest.fn();
const mockUseIsFocused = jest.fn();
const mockCreateReport = jest.fn();
const mockUseUserLocation = jest.fn();

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocationById: (...args: unknown[]) => mockGetLocationById(...args) },
}));
jest.mock('../../../services/ReportService', () => ({
  ReportService: {
    getLiveStatus: (...args: unknown[]) => mockGetLiveStatus(...args),
    createReport: (...args: unknown[]) => mockCreateReport(...args),
  },
}));
jest.mock('../../../services/RealtimeService', () => ({
  RealtimeService: { subscribeToReports: (...args: unknown[]) => mockSubscribeToReports(...args) },
}));
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => mockUseIsFocused(),
}));
jest.mock('../../../hooks/useUserLocation', () => ({
  useUserLocation: () => mockUseUserLocation(),
}));

const location = {
  id: 'loc-1',
  name: 'Test Club',
  latitude: 39.5,
  longitude: 2.6,
  images: [],
};

describe('useCommunityReportScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockSubscribeToReports.mockReturnValue(jest.fn());
    mockGetLiveStatus.mockResolvedValue(null);
  });

  it('berechnet die Distanz und erkennt „innerhalb des Radius"', async () => {
    mockGetLocationById.mockResolvedValue(location);
    mockUseUserLocation.mockReturnValue({
      status: 'granted',
      coords: { latitude: 39.5001, longitude: 2.6001 },
      isLoading: false,
      requestPermission: jest.fn(),
    });

    const { result } = renderHook(() => useCommunityReportScreen('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.distanceMeters).not.toBeNull();
    expect(result.current.distanceMeters as number).toBeLessThan(150);
    expect(result.current.isWithinGeofence).toBe(true);
  });

  it('erkennt „außerhalb des Radius" bei zu großer Distanz', async () => {
    mockGetLocationById.mockResolvedValue(location);
    mockUseUserLocation.mockReturnValue({
      status: 'granted',
      coords: { latitude: 39.6, longitude: 2.7 },
      isLoading: false,
      requestPermission: jest.fn(),
    });

    const { result } = renderHook(() => useCommunityReportScreen('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isWithinGeofence).toBe(false);
  });

  it('erlaubt das Melden, solange kein Standort vorliegt (unbekannt statt blockiert)', async () => {
    mockGetLocationById.mockResolvedValue(location);
    mockUseUserLocation.mockReturnValue({
      status: 'undetermined',
      coords: null,
      isLoading: false,
      requestPermission: jest.fn(),
    });

    const { result } = renderHook(() => useCommunityReportScreen('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.distanceMeters).toBeNull();
    expect(result.current.isWithinGeofence).toBe(false);
  });

  it('überspringt die Geofencing-Prüfung, wenn die Location keine Koordinaten hat', async () => {
    mockGetLocationById.mockResolvedValue({ ...location, latitude: null, longitude: null });
    mockUseUserLocation.mockReturnValue({
      status: 'granted',
      coords: { latitude: 39.5001, longitude: 2.6001 },
      isLoading: false,
      requestPermission: jest.fn(),
    });

    const { result } = renderHook(() => useCommunityReportScreen('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isWithinGeofence).toBe(true);
  });
});
