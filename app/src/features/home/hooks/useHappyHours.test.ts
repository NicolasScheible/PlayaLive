import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useHappyHours } from './useHappyHours';

const mockGetActiveHappyHours = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/HappyHourService', () => ({
  HappyHourService: {
    getActiveHappyHours: (...args: unknown[]) => mockGetActiveHappyHours(...args),
  },
}));

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useHappyHours', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reichert aktive Happy Hours mit dem Location-Namen an', async () => {
    mockGetActiveHappyHours.mockResolvedValue([
      { id: 'hh-1', location_id: 'loc-1', weekday: 'friday' },
    ]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useHappyHours(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.happyHours).toEqual([
      { id: 'hh-1', location_id: 'loc-1', weekday: 'friday', locationName: 'Test Club' },
    ]);
  });

  it('stößt über retry() Happy-Hours- und Locations-Query erneut an', async () => {
    mockGetActiveHappyHours.mockResolvedValue([]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useHappyHours(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetActiveHappyHours).toHaveBeenCalledTimes(1);

    result.current.retry();

    await waitFor(() => expect(mockGetActiveHappyHours).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(mockGetLocations).toHaveBeenCalledTimes(2));
  });
});
