import { useAuthStore } from './authStore';

jest.mock('../services/AuthService', () => ({
  AuthService: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
}));

jest.mock('../lib/queryClient', () => ({
  queryClient: { clear: jest.fn() },
}));

/* eslint-disable @typescript-eslint/no-require-imports */
const { AuthService } = require('../services/AuthService');
const { queryClient } = require('../lib/queryClient');
/* eslint-enable @typescript-eslint/no-require-imports */

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null, isInitializing: true });
    jest.clearAllMocks();
  });

  it('startet mit isInitializing: true und ohne Session', () => {
    const state = useAuthStore.getState();

    expect(state.isInitializing).toBe(true);
    expect(state.session).toBeNull();
  });

  it('setzt isInitializing auf false und übernimmt die geladene Session', async () => {
    const session = { access_token: 'token' } as never;
    AuthService.getSession.mockResolvedValue({ session });
    AuthService.onAuthStateChange.mockReturnValue({ unsubscribe: jest.fn() });

    useAuthStore.getState().initialize();
    await Promise.resolve();
    await Promise.resolve();

    expect(useAuthStore.getState().session).toBe(session);
    expect(useAuthStore.getState().isInitializing).toBe(false);
  });

  it('beendet isInitializing auch, wenn getSession() beim Start fehlschlägt', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    AuthService.getSession.mockRejectedValue(new Error('Netzwerkfehler'));
    AuthService.onAuthStateChange.mockReturnValue({ unsubscribe: jest.fn() });

    useAuthStore.getState().initialize();
    await Promise.resolve();
    await Promise.resolve();

    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().isInitializing).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  it('übernimmt Session-Änderungen aus onAuthStateChange', () => {
    AuthService.getSession.mockResolvedValue({ session: null });
    let capturedCallback: (event: string, session: unknown) => void = () => {};
    AuthService.onAuthStateChange.mockImplementation(
      (callback: (event: string, session: unknown) => void) => {
        capturedCallback = callback;

        return { unsubscribe: jest.fn() };
      },
    );

    useAuthStore.getState().initialize();
    const newSession = { access_token: 'new-token' } as never;
    capturedCallback('SIGNED_IN', newSession);

    expect(useAuthStore.getState().session).toBe(newSession);
  });

  describe('Query-Cache beim Nutzerwechsel (Account A -> Logout -> Account B)', () => {
    let capturedCallback: (event: string, session: unknown) => void;

    beforeEach(() => {
      jest.clearAllMocks();
      capturedCallback = () => {};
      AuthService.getSession.mockResolvedValue({ session: null });
      AuthService.onAuthStateChange.mockImplementation(
        (callback: (event: string, session: unknown) => void) => {
          capturedCallback = callback;

          return { unsubscribe: jest.fn() };
        },
      );
    });

    it('leert den Cache, wenn die Session extern ungültig wird (nicht nur beim expliziten Logout)', () => {
      useAuthStore.setState({
        session: { user: { id: 'user-a' } } as never,
        isInitializing: false,
      });
      useAuthStore.getState().initialize();

      // Simuliert einen abgelaufenen Refresh-Token/Sign-out auf einem anderen Gerät — nicht den
      // expliziten Abmelden-Button (useAuth.ts ruft `queryClient.clear()` bewusst nicht mehr selbst
      // auf, siehe dortiger Kommentar).
      capturedCallback('SIGNED_OUT', null);

      expect(queryClient.clear).toHaveBeenCalledTimes(1);
      expect(useAuthStore.getState().session).toBeNull();
    });

    it('leert den Cache, wenn sich ein anderer Nutzer auf demselben Gerät anmeldet', () => {
      useAuthStore.setState({
        session: { user: { id: 'user-a' } } as never,
        isInitializing: false,
      });
      useAuthStore.getState().initialize();

      capturedCallback('SIGNED_IN', { user: { id: 'user-b' } });

      expect(queryClient.clear).toHaveBeenCalledTimes(1);
    });

    it('leert den Cache NICHT bei einem reinen Token-Refresh desselben Nutzers', () => {
      useAuthStore.setState({
        session: { user: { id: 'user-a' } } as never,
        isInitializing: false,
      });
      useAuthStore.getState().initialize();

      capturedCallback('TOKEN_REFRESHED', { user: { id: 'user-a' } });

      expect(queryClient.clear).not.toHaveBeenCalled();
    });
  });
});
