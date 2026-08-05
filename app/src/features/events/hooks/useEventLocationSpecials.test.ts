import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useEventLocationSpecials } from './useEventLocationSpecials';

const mockGetActiveSpecialsForLocation = jest.fn();

jest.mock('../../../services/SpecialService', () => ({
  SpecialService: {
    getActiveSpecialsForLocation: (...args: unknown[]) => mockGetActiveSpecialsForLocation(...args),
  },
}));

describe('useEventLocationSpecials', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die aktiven Specials der Event-Location', async () => {
    mockGetActiveSpecialsForLocation.mockResolvedValue([{ id: 'sp-1' }]);

    const { result } = renderHook(() => useEventLocationSpecials('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.specials).toEqual([{ id: 'sp-1' }]);
    expect(mockGetActiveSpecialsForLocation).toHaveBeenCalledWith('loc-1');
  });

  it('fragt nichts ab, solange keine Location-ID vorliegt', () => {
    renderHook(() => useEventLocationSpecials(null), { wrapper: createQueryWrapper() });

    expect(mockGetActiveSpecialsForLocation).not.toHaveBeenCalled();
  });
});
