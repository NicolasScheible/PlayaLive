import { act, renderHook } from '@testing-library/react-native';

import { useGoogleSignIn } from './useGoogleSignIn';

const mockUseIdTokenAuthRequest = jest.fn();
const mockPromptAsync = jest.fn();
const mockSignInWithGoogle = jest.fn();

jest.mock('expo-auth-session/providers/google', () => ({
  useIdTokenAuthRequest: (...args: unknown[]) => mockUseIdTokenAuthRequest(...args),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('../../../services/AuthService', () => ({
  AuthService: { signInWithGoogle: (...args: unknown[]) => mockSignInWithGoogle(...args) },
}));

describe('useGoogleSignIn', () => {
  beforeEach(() => {
    mockUseIdTokenAuthRequest.mockReturnValue([{}, null, mockPromptAsync]);
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID = 'web-client-id';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
    delete process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
    delete process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  });

  it('meldet isConfigured=false ohne gesetzte Client-IDs und öffnet keinen Dialog', async () => {
    delete process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

    const { result } = renderHook(() => useGoogleSignIn());

    expect(result.current.isConfigured).toBe(false);

    await act(async () => {
      await result.current.signIn();
    });

    expect(mockPromptAsync).not.toHaveBeenCalled();
  });

  it('meldet isConfigured=true, wenn mindestens eine Client-ID gesetzt ist', () => {
    const { result } = renderHook(() => useGoogleSignIn());

    expect(result.current.isConfigured).toBe(true);
  });

  it('meldet sich mit dem id_token beim AuthService an', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'success', params: { id_token: 'google-id-token' } });
    mockSignInWithGoogle.mockResolvedValue(undefined);

    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(mockSignInWithGoogle).toHaveBeenCalledWith('google-id-token');
    expect(result.current.error).toBeNull();
  });

  it('ignoriert einen abgebrochenen Dialog ohne Fehlermeldung', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'cancel' });

    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBeNull();
    expect(mockSignInWithGoogle).not.toHaveBeenCalled();
  });

  it('meldet einen Fehler, wenn die AuthSession fehlschlägt', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'error', params: {} });

    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error?.code).toBe('AUTH_GOOGLE_SIGN_IN_FAILED');
  });

  it('meldet einen Fehler vom AuthService', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'success', params: { id_token: 'google-id-token' } });
    mockSignInWithGoogle.mockRejectedValue({
      code: 'AUTH_INVALID_CREDENTIALS',
      messageKey: 'x',
      message: 'E-Mail oder Passwort ist falsch.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error?.code).toBe('AUTH_INVALID_CREDENTIALS');
  });
});
