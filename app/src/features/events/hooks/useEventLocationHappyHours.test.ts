import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useEventLocationHappyHours } from './useEventLocationHappyHours';

const mockGetActiveHappyHoursForLocation = jest.fn();

jest.mock('../../../services/HappyHourService', () => ({
  HappyHourService: {
    getActiveHappyHoursForLocation: (...args: unknown[]) =>
      mockGetActiveHappyHoursForLocation(...args),
  },
}));

describe('useEventLocationHappyHours', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die aktiven Happy Hours der Event-Location', async () => {
    mockGetActiveHappyHoursForLocation.mockResolvedValue([{ id: 'hh-1' }]);

    const { result } = renderHook(() => useEventLocationHappyHours('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.happyHours).toEqual([{ id: 'hh-1' }]);
    expect(mockGetActiveHappyHoursForLocation).toHaveBeenCalledWith('loc-1');
  });

  it('fragt nichts ab, solange keine Location-ID vorliegt', () => {
    renderHook(() => useEventLocationHappyHours(null), { wrapper: createQueryWrapper() });

    expect(mockGetActiveHappyHoursForLocation).not.toHaveBeenCalled();
  });
});
