import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useReportLocation } from './useReportLocation';

const mockGetLocationById = jest.fn();

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocationById: (...args: unknown[]) => mockGetLocationById(...args) },
}));

describe('useReportLocation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die Location', async () => {
    const location = { id: 'loc-1', name: 'Test Club' };
    mockGetLocationById.mockResolvedValue(location);

    const { result } = renderHook(() => useReportLocation('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.location).toEqual(location);
    expect(result.current.notFound).toBe(false);
    expect(mockGetLocationById).toHaveBeenCalledWith('loc-1');
  });

  it('erkennt notFound, wenn keine Location gefunden wird', async () => {
    mockGetLocationById.mockResolvedValue(null);

    const { result } = renderHook(() => useReportLocation('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.notFound).toBe(true);
  });
});
