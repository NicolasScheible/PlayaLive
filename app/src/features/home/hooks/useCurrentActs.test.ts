import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useCurrentActs } from './useCurrentActs';

const mockGetCurrentEvents = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/EventService', () => ({
  EventService: { getCurrentEvents: (...args: unknown[]) => mockGetCurrentEvents(...args) },
}));

jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

describe('useCurrentActs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reichert aktuell laufende Events mit dem Location-Namen an', async () => {
    mockGetCurrentEvents.mockResolvedValue([
      { id: 'event-1', location_id: 'loc-1', title: 'Live Now' },
    ]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useCurrentActs(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.acts).toEqual([
      { id: 'event-1', location_id: 'loc-1', title: 'Live Now', locationName: 'Test Club' },
    ]);
  });

  it('meldet isError, wenn EventService fehlschlägt', async () => {
    mockGetCurrentEvents.mockRejectedValue({ code: 'UNKNOWN_ERROR', message: 'boom' });
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useCurrentActs(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.acts).toEqual([]);
  });
});
