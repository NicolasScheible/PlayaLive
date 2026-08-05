import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useReportLocationLiveStatus } from './useReportLocationLiveStatus';

const mockGetLiveStatus = jest.fn();
const mockSubscribeToReports = jest.fn();
const mockUseIsFocused = jest.fn();

jest.mock('../../../services/ReportService', () => ({
  ReportService: { getLiveStatus: (...args: unknown[]) => mockGetLiveStatus(...args) },
}));

jest.mock('../../../services/RealtimeService', () => ({
  RealtimeService: { subscribeToReports: (...args: unknown[]) => mockSubscribeToReports(...args) },
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => mockUseIsFocused(),
}));

describe('useReportLocationLiveStatus', () => {
  const unsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsFocused.mockReturnValue(true);
    mockSubscribeToReports.mockReturnValue(unsubscribe);
  });

  it('lädt den Live-Status der Location', async () => {
    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'medium' });

    const { result } = renderHook(() => useReportLocationLiveStatus('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.liveStatus).toEqual({ location_id: 'loc-1', occupancy_level: 'medium' });
    expect(mockGetLiveStatus).toHaveBeenCalledWith('loc-1');
  });

  it('abonniert Report-Updates, solange der Screen fokussiert ist', async () => {
    mockGetLiveStatus.mockResolvedValue(null);

    renderHook(() => useReportLocationLiveStatus('loc-1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockSubscribeToReports).toHaveBeenCalledTimes(1));
  });

  it('abonniert keine Report-Updates, wenn der Screen nicht fokussiert ist', async () => {
    mockUseIsFocused.mockReturnValue(false);
    mockGetLiveStatus.mockResolvedValue(null);

    renderHook(() => useReportLocationLiveStatus('loc-1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockGetLiveStatus).toHaveBeenCalled());

    expect(mockSubscribeToReports).not.toHaveBeenCalled();
  });

  it('aktualisiert nur bei Reports für diese Location, ohne kompletten Reload', async () => {
    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'low' });

    renderHook(() => useReportLocationLiveStatus('loc-1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(mockSubscribeToReports).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockGetLiveStatus).toHaveBeenCalledTimes(1));

    const onBatch = mockSubscribeToReports.mock.calls[0][0] as (reports: unknown[]) => void;

    mockGetLiveStatus.mockResolvedValue({ location_id: 'loc-1', occupancy_level: 'high' });
    onBatch([{ location_id: 'loc-other' }]);

    await waitFor(() => expect(mockGetLiveStatus).toHaveBeenCalledTimes(1));

    onBatch([{ location_id: 'loc-1' }]);

    await waitFor(() => expect(mockGetLiveStatus).toHaveBeenCalledTimes(2));
  });

  it('beendet die Subscription beim Unmount', async () => {
    mockGetLiveStatus.mockResolvedValue(null);

    const { unmount } = renderHook(() => useReportLocationLiveStatus('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(mockSubscribeToReports).toHaveBeenCalledTimes(1));

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
