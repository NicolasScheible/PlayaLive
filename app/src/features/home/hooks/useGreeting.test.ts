import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useGreeting } from './useGreeting';

const mockGetProfile = jest.fn();

jest.mock('../../../services/AuthService', () => ({
  AuthService: { getProfile: (...args: unknown[]) => mockGetProfile(...args) },
}));

describe('useGreeting', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert einen Tageszeit-Gruß und den Anzeigenamen aus dem Profil', async () => {
    mockGetProfile.mockResolvedValue({ display_name: 'Lisa' });

    const { result } = renderHook(() => useGreeting(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.displayName).toBe('Lisa');
    expect(result.current.greeting.length).toBeGreaterThan(0);
  });

  it('degradiert auf displayName = null, wenn das Profil nicht geladen werden kann', async () => {
    mockGetProfile.mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useGreeting(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.displayName).toBeNull();
  });
});
