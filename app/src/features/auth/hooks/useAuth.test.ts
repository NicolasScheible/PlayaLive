import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAuthStore } from '../../../store/authStore';

import { useAuth } from './useAuth';

jest.mock('../../../services/AuthService', () => ({
  AuthService: {
    signInWithPassword: jest.fn(),
    signUpWithPassword: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    signOut: jest.fn(),
  },
}));

jest.mock('../../../lib/queryClient', () => ({
  queryClient: { clear: jest.fn() },
}));

/* eslint-disable @typescript-eslint/no-require-imports */
const { queryClient } = require('../../../lib/queryClient');
const { AuthService } = require('../../../services/AuthService');
/* eslint-enable @typescript-eslint/no-require-imports */

describe('useAuth', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null, isInitializing: false });
    jest.clearAllMocks();
  });

  it('setzt loading während des Logins und löscht es danach', async () => {
    AuthService.signInWithPassword.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(false);

    await act(async () => {
      await result.current.login('a@b.de', 'geheim123');
    });

    expect(AuthService.signInWithPassword).toHaveBeenCalledWith('a@b.de', 'geheim123');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('übernimmt einen AppError aus dem AuthService bei fehlgeschlagenem Login', async () => {
    const appError = {
      code: 'AUTH_INVALID_CREDENTIALS',
      messageKey: 'errors.auth.AUTH_INVALID_CREDENTIALS',
      message: 'E-Mail oder Passwort ist falsch.',
      technicalMessage: 'Invalid login credentials',
    };
    AuthService.signInWithPassword.mockRejectedValue(appError);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('a@b.de', 'falsch');
    });

    await waitFor(() => expect(result.current.error).toEqual(appError));
    expect(result.current.loading).toBe(false);
  });

  it('leert den Query-Cache beim Logout', async () => {
    AuthService.signOut.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(AuthService.signOut).toHaveBeenCalled();
    expect(queryClient.clear).toHaveBeenCalled();
  });

  it('liefert user aus der Session aus dem authStore', () => {
    const session = { user: { id: 'user-1' } } as never;
    useAuthStore.setState({ session, isInitializing: false });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({ id: 'user-1' });
  });
});
