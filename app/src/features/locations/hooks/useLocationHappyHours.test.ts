import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useLocationHappyHours } from './useLocationHappyHours';

const mockGetActiveHappyHoursForLocation = jest.fn();

jest.mock('../../../services/HappyHourService', () => ({
  HappyHourService: {
    getActiveHappyHoursForLocation: (...args: unknown[]) =>
      mockGetActiveHappyHoursForLocation(...args),
  },
}));

describe('useLocationHappyHours', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die aktiven Happy Hours der Location', async () => {
    mockGetActiveHappyHoursForLocation.mockResolvedValue([{ id: 'hh-1' }]);

    const { result } = renderHook(() => useLocationHappyHours('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.happyHours).toEqual([{ id: 'hh-1' }]);
    expect(mockGetActiveHappyHoursForLocation).toHaveBeenCalledWith('loc-1');
  });
});
