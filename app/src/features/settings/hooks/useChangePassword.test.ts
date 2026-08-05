import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useChangePassword } from './useChangePassword';

const mockChangePassword = jest.fn();

jest.mock('../../../services/AuthService', () => ({
  AuthService: { changePassword: (...args: unknown[]) => mockChangePassword(...args) },
}));

describe('useChangePassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft AuthService.changePassword mit dem neuen Passwort auf', async () => {
    mockChangePassword.mockResolvedValue(undefined);

    const { result } = renderHook(() => useChangePassword(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.changePassword('neuesPasswort123');
    });

    expect(mockChangePassword).toHaveBeenCalledWith('neuesPasswort123');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('meldet einen Fehler aus dem AuthService', async () => {
    mockChangePassword.mockRejectedValue({
      code: 'AUTH_WEAK_PASSWORD',
      messageKey: 'x',
      message: 'Das Passwort ist zu kurz.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useChangePassword(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.changePassword('123').catch(() => {});
    });

    await waitFor(() => expect(result.current.error?.code).toBe('AUTH_WEAK_PASSWORD'));
  });
});
