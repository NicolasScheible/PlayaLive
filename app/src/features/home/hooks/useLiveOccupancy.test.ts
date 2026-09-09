import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useLiveOccupancy } from './useLiveOccupancy';

const mockGetLocations = jest.fn();
const mockGetLiveStatus = jest.fn();

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

jest.mock('../../../services/ReportService', () => ({
  ReportService: { getLiveStatus: (...args: unknown[]) => mockGetLiveStatus(...args) },
}));

describe('useLiveOccupancy', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('kombiniert jede Location mit ihrem Live-Status', async () => {
    const locations = [
      { id: 'loc-1', name: 'Club A' },
      { id: 'loc-2', name: 'Club B' },
    ];
    mockGetLocations.mockResolvedValue(locations);
    mockGetLiveStatus.mockImplementation((locationId: string) =>
      Promise.resolve({ location_id: locationId, occupancy_level: 'high' }),
    );

    const { result } = renderHook(() => useLiveOccupancy(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetLiveStatus).toHaveBeenCalledWith('loc-1');
    expect(mockGetLiveStatus).toHaveBeenCalledWith('loc-2');
    expect(result.current.occupancies).toEqual([
      { location: locations[0], liveStatus: { location_id: 'loc-1', occupancy_level: 'high' } },
      { location: locations[1], liveStatus: { location_id: 'loc-2', occupancy_level: 'high' } },
    ]);
  });

  it('meldet isError, wenn LocationService fehlschlägt', async () => {
    mockGetLocations.mockRejectedValue({ code: 'UNKNOWN_ERROR', message: 'boom' });

    const { result } = renderHook(() => useLiveOccupancy(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.occupancies).toEqual([]);
  });

  it('stößt über retry() beide zugrundeliegenden Queries erneut an', async () => {
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Club A' }]);
    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'high' });

    const { result } = renderHook(() => useLiveOccupancy(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetLocations).toHaveBeenCalledTimes(1);

    result.current.retry();

    await waitFor(() => expect(mockGetLocations).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(mockGetLiveStatus).toHaveBeenCalledTimes(2));
  });
});
