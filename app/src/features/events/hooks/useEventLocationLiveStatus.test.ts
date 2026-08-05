import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useEventLocationLiveStatus } from './useEventLocationLiveStatus';

const mockGetLiveStatus = jest.fn();

jest.mock('../../../services/ReportService', () => ({
  ReportService: { getLiveStatus: (...args: unknown[]) => mockGetLiveStatus(...args) },
}));

describe('useEventLocationLiveStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt den Live-Status der Event-Location', async () => {
    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'medium' });

    const { result } = renderHook(() => useEventLocationLiveStatus('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.liveStatus).toEqual({ location_id: 'loc-1', occupancy_level: 'medium' });
    expect(mockGetLiveStatus).toHaveBeenCalledWith('loc-1');
  });

  it('fragt nichts ab, solange keine Location-ID vorliegt', () => {
    renderHook(() => useEventLocationLiveStatus(null), { wrapper: createQueryWrapper() });

    expect(mockGetLiveStatus).not.toHaveBeenCalled();
  });
});
