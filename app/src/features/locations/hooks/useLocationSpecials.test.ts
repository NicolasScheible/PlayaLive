import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useLocationSpecials } from './useLocationSpecials';

const mockGetActiveSpecialsForLocation = jest.fn();

jest.mock('../../../services/SpecialService', () => ({
  SpecialService: {
    getActiveSpecialsForLocation: (...args: unknown[]) => mockGetActiveSpecialsForLocation(...args),
  },
}));

describe('useLocationSpecials', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die aktiven Specials der Location', async () => {
    mockGetActiveSpecialsForLocation.mockResolvedValue([{ id: 'sp-1' }]);

    const { result } = renderHook(() => useLocationSpecials('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.specials).toEqual([{ id: 'sp-1' }]);
    expect(mockGetActiveSpecialsForLocation).toHaveBeenCalledWith('loc-1');
  });
});
