import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useMapLocations } from './useMapLocations';

const mockGetLocations = jest.fn();
const mockGetLiveStatus = jest.fn();
const mockSubscribeToReports = jest.fn();
const mockUseIsFocused = jest.fn();

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

jest.mock('../../../services/ReportService', () => ({
  ReportService: { getLiveStatus: (...args: unknown[]) => mockGetLiveStatus(...args) },
}));

jest.mock('../../../services/RealtimeService', () => ({
  RealtimeService: { subscribeToReports: (...args: unknown[]) => mockSubscribeToReports(...args) },
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => mockUseIsFocused(),
}));

const locationWithCoords = {
  id: 'loc-1',
  name: 'Test Club',
  category: 'club',
  latitude: 39.5,
  longitude: 2.6,
  images: [],
  opening_hours: null,
};
const locationWithoutCoords = {
  id: 'loc-2',
  name: 'Ohne Koordinaten',
  category: 'bar',
  latitude: null,
  longitude: null,
  images: [],
  opening_hours: null,
};

describe('useMapLocations', () => {
  const unsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockSubscribeToReports.mockReturnValue(unsubscribe);
  });

  it('lädt Locations mit Live-Status und filtert Locations ohne Koordinaten heraus', async () => {
    mockGetLocations.mockResolvedValue([locationWithCoords, locationWithoutCoords]);
    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'medium' });

    const { result } = renderHook(() => useMapLocations(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.locations).toEqual([
      { ...locationWithCoords, liveStatus: { location_id: 'loc-1', occupancy_level: 'medium' } },
    ]);
  });

  it('abonniert Report-Updates, solange der Screen fokussiert ist', async () => {
    mockGetLocations.mockResolvedValue([locationWithCoords]);
    mockGetLiveStatus.mockResolvedValue(null);

    renderHook(() => useMapLocations(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockSubscribeToReports).toHaveBeenCalledTimes(1));
  });

  it('abonniert keine Report-Updates, wenn der Screen nicht fokussiert ist', async () => {
    mockUseIsFocused.mockReturnValue(false);
    mockGetLocations.mockResolvedValue([locationWithCoords]);
    mockGetLiveStatus.mockResolvedValue(null);

    renderHook(() => useMapLocations(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockGetLocations).toHaveBeenCalled());

    expect(mockSubscribeToReports).not.toHaveBeenCalled();
  });

  it('beendet die Subscription beim Unmount', async () => {
    mockGetLocations.mockResolvedValue([locationWithCoords]);
    mockGetLiveStatus.mockResolvedValue(null);

    const { unmount } = renderHook(() => useMapLocations(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockSubscribeToReports).toHaveBeenCalledTimes(1));

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('aktualisiert den Live-Status der betroffenen Location aus einem Report-Batch, ohne alle Locations neu zu laden', async () => {
    mockGetLocations.mockResolvedValue([locationWithCoords]);
    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'low' });

    renderHook(() => useMapLocations(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockSubscribeToReports).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockGetLiveStatus).toHaveBeenCalledTimes(1));

    const onBatch = mockSubscribeToReports.mock.calls[0][0] as (reports: unknown[]) => void;
    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'high' });
    onBatch([{ location_id: 'loc-1' }]);

    await waitFor(() => expect(mockGetLocations).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockGetLiveStatus).toHaveBeenCalledTimes(2));
  });
});
