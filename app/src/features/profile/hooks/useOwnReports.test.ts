import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useOwnReports } from './useOwnReports';

const mockGetOwnReports = jest.fn();
const mockGetLocations = jest.fn();

jest.mock('../../../services/ReportService', () => ({
  ReportService: { getOwnReports: (...args: unknown[]) => mockGetOwnReports(...args) },
}));
jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));

const report = {
  id: 'report-1',
  user_id: 'user-1',
  location_id: 'loc-1',
  occupancy_level: 'high' as const,
  wait_time_minutes: 15,
  mood: null,
  music_genre: null,
  comment: null,
  latitude: 39.5,
  longitude: 2.6,
  created_at: '',
};

describe('useOwnReports', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('löst den Location-Namen für jeden eigenen Report auf', async () => {
    mockGetOwnReports.mockResolvedValue([report]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);

    const { result } = renderHook(() => useOwnReports(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.reports).toEqual([{ ...report, locationName: 'Test Club' }]);
  });

  it('nutzt einen Platzhalter-Namen, wenn die Location nicht gefunden wird', async () => {
    mockGetOwnReports.mockResolvedValue([report]);
    mockGetLocations.mockResolvedValue([]);

    const { result } = renderHook(() => useOwnReports(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.reports[0].locationName).toBe('Unbekannte Location');
  });
});
