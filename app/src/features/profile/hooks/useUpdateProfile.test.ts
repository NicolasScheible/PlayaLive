import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useUpdateProfile } from './useUpdateProfile';

const mockUpdateProfile = jest.fn();

jest.mock('../../../services/AuthService', () => ({
  AuthService: { updateProfile: (...args: unknown[]) => mockUpdateProfile(...args) },
}));

describe('useUpdateProfile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft AuthService.updateProfile mit den übergebenen Feldern auf', async () => {
    const updated = { id: 'user-1', display_name: 'Neuer Name' };
    mockUpdateProfile.mockResolvedValue(updated);

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.updateProfile({ displayName: 'Neuer Name' });
    });

    expect(mockUpdateProfile).toHaveBeenCalledWith({ displayName: 'Neuer Name' });
    await waitFor(() => expect(result.current.isSaving).toBe(false));
  });
});
