import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useLocationDetail } from './useLocationDetail';

const mockGetLocationById = jest.fn();

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocationById: (...args: unknown[]) => mockGetLocationById(...args) },
}));

describe('useLocationDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert die Location vom LocationService', async () => {
    const location = { id: 'loc-1', name: 'Test Club', liveStatus: null };
    mockGetLocationById.mockResolvedValue(location);

    const { result } = renderHook(() => useLocationDetail('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.location).toEqual(location);
    expect(result.current.notFound).toBe(false);
    expect(mockGetLocationById).toHaveBeenCalledWith('loc-1');
  });

  it('markiert notFound, wenn keine Location gefunden wurde', async () => {
    mockGetLocationById.mockResolvedValue(null);

    const { result } = renderHook(() => useLocationDetail('loc-missing'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.location).toBeNull();
    expect(result.current.notFound).toBe(true);
  });

  it('markiert isError bei einem Ladefehler, nicht notFound', async () => {
    mockGetLocationById.mockRejectedValue({
      code: 'SERVER_ERROR',
      messageKey: 'errors.database.SERVER_ERROR',
      message: 'Fehler',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useLocationDetail('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.notFound).toBe(false);
  });
});
