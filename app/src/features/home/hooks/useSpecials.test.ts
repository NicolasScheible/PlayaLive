import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useSpecials } from './useSpecials';

const mockGetActiveSpecials = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/SpecialService', () => ({
  SpecialService: { getActiveSpecials: (...args: unknown[]) => mockGetActiveSpecials(...args) },
}));

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useSpecials', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reichert aktive Specials mit dem Location-Namen an', async () => {
    mockGetActiveSpecials.mockResolvedValue([
      { id: 'special-1', location_id: 'loc-1', title: 'Ladies Night' },
    ]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useSpecials(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.specials).toEqual([
      { id: 'special-1', location_id: 'loc-1', title: 'Ladies Night', locationName: 'Test Club' },
    ]);
  });

  it('stößt über retry() Specials- und Locations-Query erneut an', async () => {
    mockGetActiveSpecials.mockResolvedValue([]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useSpecials(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetActiveSpecials).toHaveBeenCalledTimes(1);

    result.current.retry();

    await waitFor(() => expect(mockGetActiveSpecials).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(mockGetLocations).toHaveBeenCalledTimes(2));
  });
});
