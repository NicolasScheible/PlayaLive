import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useLocations } from './useLocations';

const mockGetLocations = jest.fn();

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useLocations', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert die Location-Liste vom LocationService', async () => {
    const locations = [{ id: 'loc-1', name: 'Test Club' }];
    mockGetLocations.mockResolvedValue(locations);

    const { result } = renderHook(() => useLocations(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(locations);
  });
});
