import { act, renderHook, waitFor } from '@testing-library/react-native';

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

// Auf nativen Plattformen liefert `useIdTokenAuthRequest()` das tatsächliche Ergebnis (inkl.
// id_token nach Code-Tausch) ausschließlich über den zweiten Rückgabewert (`response`), auf einem
// späteren Render — nicht über den von `promptAsync()` aufgelösten Wert. Der Mock hier bildet das
// nach: `mockResponse(...)` legt fest, was der NÄCHSTE Render von `useIdTokenAuthRequest`
// zurückgibt, `promptAsync` selbst liefert nur den rohen (hier irrelevanten) Zwischenstand.
function mockResponse(response: unknown) {
  mockUseIdTokenAuthRequest.mockReturnValue([{}, response, mockPromptAsync]);
}

describe('useGoogleSignIn', () => {
  beforeEach(() => {
    mockResponse(null);
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

  it('meldet sich mit dem id_token aus der response beim AuthService an', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'success', params: { code: 'auth-code' } });
    mockSignInWithGoogle.mockResolvedValue(undefined);

    const { result, rerender } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.loading).toBe(true);
    expect(mockSignInWithGoogle).not.toHaveBeenCalled();

    // Simuliert den asynchronen Code-Tausch von expo-auth-session, der auf einem späteren Render
    // den zweiten Rückgabewert (`response`) mit dem tatsächlichen id_token aktualisiert.
    mockResponse({ type: 'success', params: { id_token: 'google-id-token' } });
    rerender({});

    await waitFor(() => expect(mockSignInWithGoogle).toHaveBeenCalledWith('google-id-token'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it('ignoriert einen abgebrochenen Dialog ohne Fehlermeldung', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'cancel' });

    const { result, rerender } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    mockResponse({ type: 'cancel' });
    rerender({});

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(mockSignInWithGoogle).not.toHaveBeenCalled();
  });

  it('meldet einen Fehler, wenn die AuthSession fehlschlägt', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'error', params: {} });

    const { result, rerender } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    mockResponse({ type: 'error', params: {} });
    rerender({});

    await waitFor(() => expect(result.current.error?.code).toBe('AUTH_GOOGLE_SIGN_IN_FAILED'));
  });

  it('meldet einen Fehler vom AuthService', async () => {
    mockPromptAsync.mockResolvedValue({ type: 'success', params: { code: 'auth-code' } });
    mockSignInWithGoogle.mockRejectedValue({
      code: 'AUTH_INVALID_CREDENTIALS',
      messageKey: 'x',
      message: 'E-Mail oder Passwort ist falsch.',
      technicalMessage: 'x',
    });

    const { result, rerender } = renderHook(() => useGoogleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    mockResponse({ type: 'success', params: { id_token: 'google-id-token' } });
    rerender({});

    await waitFor(() => expect(result.current.error?.code).toBe('AUTH_INVALID_CREDENTIALS'));
  });
});
