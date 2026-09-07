import { useAuthStore } from './authStore';

jest.mock('../services/AuthService', () => ({
  AuthService: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { AuthService } = require('../services/AuthService');

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
});
