import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useCreateReport } from './useCreateReport';

const mockCreateReport = jest.fn();

jest.mock('../../../services/ReportService', () => ({
  ReportService: { createReport: (...args: unknown[]) => mockCreateReport(...args) },
}));

describe('useCreateReport', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft ReportService.createReport mit der Eingabe auf und meldet Erfolg', async () => {
    const report = { id: 'report-1', location_id: 'loc-1', occupancy_level: 'high' };
    mockCreateReport.mockResolvedValue(report);

    const { result } = renderHook(() => useCreateReport('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.createReport({
        locationId: 'loc-1',
        occupancyLevel: 'high',
        latitude: 39.5,
        longitude: 2.6,
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockCreateReport).toHaveBeenCalledWith({
      locationId: 'loc-1',
      occupancyLevel: 'high',
      latitude: 39.5,
      longitude: 2.6,
    });
  });

  it('meldet einen Fehler, z. B. Geofencing', async () => {
    mockCreateReport.mockRejectedValue({
      code: 'REPORT_GEOFENCE_TOO_FAR',
      messageKey: 'x',
      message: 'Du befindest dich zu weit von dieser Location entfernt.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useCreateReport('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.createReport({
        locationId: 'loc-1',
        occupancyLevel: 'high',
        latitude: 39.5,
        longitude: 2.6,
      });
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.code).toBe('REPORT_GEOFENCE_TOO_FAR');
    expect(result.current.isSuccess).toBe(false);
  });
});
