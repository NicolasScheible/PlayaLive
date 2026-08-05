import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useProfile } from './useProfile';

const mockGetProfile = jest.fn();

jest.mock('../../../services/AuthService', () => ({
  AuthService: { getProfile: (...args: unknown[]) => mockGetProfile(...args) },
}));

describe('useProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt das eigene Profil', async () => {
    const profile = { id: 'user-1', display_name: 'DJ Test' };
    mockGetProfile.mockResolvedValue(profile);

    const { result } = renderHook(() => useProfile(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.profile).toEqual(profile);
  });

  it('meldet einen Fehlerzustand', async () => {
    mockGetProfile.mockRejectedValue({
      code: 'AUTH_SESSION_MISSING',
      messageKey: 'x',
      message: 'x',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useProfile(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.profile).toBeNull();
  });
});
