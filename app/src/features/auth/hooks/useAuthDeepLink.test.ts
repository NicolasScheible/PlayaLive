import { renderHook, waitFor } from '@testing-library/react-native';

import { useAuthDeepLink } from './useAuthDeepLink';

const mockGetInitialURL = jest.fn();
const mockAddEventListener = jest.fn();
const mockHandleAuthCallbackUrl = jest.fn();

jest.mock('expo-linking', () => ({
  getInitialURL: (...args: unknown[]) => mockGetInitialURL(...args),
  addEventListener: (...args: unknown[]) => mockAddEventListener(...args),
}));

jest.mock('../../../services/AuthService', () => ({
  AuthService: {
    handleAuthCallbackUrl: (...args: unknown[]) => mockHandleAuthCallbackUrl(...args),
  },
}));

describe('useAuthDeepLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInitialURL.mockResolvedValue(null);
    mockAddEventListener.mockReturnValue({ remove: jest.fn() });
    mockHandleAuthCallbackUrl.mockResolvedValue(undefined);
  });

  it('verarbeitet die Start-URL, wenn die App über einen Bestätigungslink geöffnet wurde (Fall A)', async () => {
    mockGetInitialURL.mockResolvedValue('playalive://auth/callback?code=abc123');

    renderHook(() => useAuthDeepLink());

    await waitFor(() =>
      expect(mockHandleAuthCallbackUrl).toHaveBeenCalledWith(
        'playalive://auth/callback?code=abc123',
      ),
    );
  });

  it('verarbeitet nichts, wenn die App ohne Link gestartet wurde', async () => {
    renderHook(() => useAuthDeepLink());

    await waitFor(() => expect(mockGetInitialURL).toHaveBeenCalledTimes(1));
    expect(mockHandleAuthCallbackUrl).not.toHaveBeenCalled();
  });

  it('verarbeitet einen Link, der eintrifft während die App bereits offen ist (Fall B)', () => {
    let urlListener: (event: { url: string }) => void = () => undefined;
    mockAddEventListener.mockImplementation((_event, listener) => {
      urlListener = listener;

      return { remove: jest.fn() };
    });

    renderHook(() => useAuthDeepLink());
    urlListener({ url: 'playalive://auth/callback?code=abc123' });

    expect(mockHandleAuthCallbackUrl).toHaveBeenCalledWith('playalive://auth/callback?code=abc123');
  });

  it('meldet sich beim Unmount vom Listener ab', () => {
    const remove = jest.fn();
    mockAddEventListener.mockReturnValue({ remove });

    const { unmount } = renderHook(() => useAuthDeepLink());
    unmount();

    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('wirft keinen ungefangenen Fehler, wenn getInitialURL() selbst ablehnt', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockGetInitialURL.mockRejectedValue(new Error('Linking nicht verfügbar'));

    renderHook(() => useAuthDeepLink());

    await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());
    expect(mockHandleAuthCallbackUrl).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('wirft keinen ungefangenen Fehler, wenn die Verarbeitung fehlschlägt', async () => {
    mockGetInitialURL.mockResolvedValue('playalive://auth/callback?error_description=abgelaufen');
    mockHandleAuthCallbackUrl.mockRejectedValue({
      code: 'AUTH_LINK_INVALID',
      messageKey: 'errors.auth.AUTH_LINK_INVALID',
      message: 'Der Link ist ungültig oder abgelaufen.',
      technicalMessage: 'abgelaufen',
    });

    renderHook(() => useAuthDeepLink());

    await waitFor(() => expect(mockHandleAuthCallbackUrl).toHaveBeenCalled());
  });
});
