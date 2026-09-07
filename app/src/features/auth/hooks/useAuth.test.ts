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

jest.mock('../../../services/NotificationService', () => ({
  NotificationService: { removePushToken: jest.fn() },
}));

jest.mock('../../../lib/queryClient', () => ({
  queryClient: { clear: jest.fn() },
}));

/* eslint-disable @typescript-eslint/no-require-imports */
const { queryClient } = require('../../../lib/queryClient');
const { AuthService } = require('../../../services/AuthService');
const { NotificationService } = require('../../../services/NotificationService');
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

  it('meldet Erfolg, wenn AuthService.signUpWithPassword auflöst', async () => {
    AuthService.signUpWithPassword.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.register({
        email: 'a@b.de',
        password: 'geheim123',
        username: 'Nutzer',
      });
    });

    expect(AuthService.signUpWithPassword).toHaveBeenCalledWith({
      email: 'a@b.de',
      password: 'geheim123',
      username: 'Nutzer',
    });
    expect(success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('übernimmt einen AppError aus dem AuthService bei fehlgeschlagener Registrierung', async () => {
    const appError = {
      code: 'AUTH_EMAIL_ALREADY_REGISTERED',
      messageKey: 'errors.auth.AUTH_EMAIL_ALREADY_REGISTERED',
      message: 'Für diese E-Mail-Adresse besteht bereits ein Konto.',
      technicalMessage: 'User already registered',
    };
    AuthService.signUpWithPassword.mockRejectedValue(appError);
    const { result } = renderHook(() => useAuth());

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.register({
        email: 'a@b.de',
        password: 'geheim123',
        username: 'Nutzer',
      });
    });

    expect(success).toBe(false);
    expect(result.current.error).toEqual(appError);
    expect(result.current.loading).toBe(false);
  });

  it('leert den Query-Cache beim Logout', async () => {
    AuthService.signOut.mockResolvedValue(undefined);
    NotificationService.removePushToken.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(AuthService.signOut).toHaveBeenCalled();
    expect(queryClient.clear).toHaveBeenCalled();
  });

  it('entfernt das Push-Token vor dem Abmelden (ADR-007: Token-Lebenszyklus)', async () => {
    AuthService.signOut.mockResolvedValue(undefined);
    NotificationService.removePushToken.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(NotificationService.removePushToken).toHaveBeenCalledTimes(1);
  });

  it('meldet trotzdem ab, wenn das Entfernen des Push-Tokens fehlschlägt', async () => {
    AuthService.signOut.mockResolvedValue(undefined);
    NotificationService.removePushToken.mockRejectedValue(new Error('kein Token registriert'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(AuthService.signOut).toHaveBeenCalled();
    expect(queryClient.clear).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('liefert user aus der Session aus dem authStore', () => {
    const session = { user: { id: 'user-1' } } as never;
    useAuthStore.setState({ session, isInitializing: false });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual({ id: 'user-1' });
  });
});
