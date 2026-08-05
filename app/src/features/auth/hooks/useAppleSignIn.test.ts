import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useAppleSignIn } from './useAppleSignIn';

const mockIsAvailableAsync = jest.fn();
const mockSignInAsync = jest.fn();
const mockSignInWithApple = jest.fn();
const mockDigestStringAsync = jest.fn();
const mockRandomUUID = jest.fn();

jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: (...args: unknown[]) => mockIsAvailableAsync(...args),
  signInAsync: (...args: unknown[]) => mockSignInAsync(...args),
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
}));

jest.mock('expo-crypto', () => ({
  randomUUID: (...args: unknown[]) => mockRandomUUID(...args),
  digestStringAsync: (...args: unknown[]) => mockDigestStringAsync(...args),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

jest.mock('../../../services/AuthService', () => ({
  AuthService: { signInWithApple: (...args: unknown[]) => mockSignInWithApple(...args) },
}));

describe('useAppleSignIn', () => {
  beforeEach(() => {
    mockRandomUUID.mockReturnValue('raw-nonce');
    mockDigestStringAsync.mockResolvedValue('hashed-nonce');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liest die Verfügbarkeit beim Mount aus, ohne den Dialog zu öffnen', async () => {
    mockIsAvailableAsync.mockResolvedValue(true);

    const { result } = renderHook(() => useAppleSignIn());

    await waitFor(() => expect(result.current.isAvailable).toBe(true));

    expect(mockSignInAsync).not.toHaveBeenCalled();
  });

  it('meldet sich mit dem Identity-Token und dem rohen Nonce beim AuthService an', async () => {
    mockIsAvailableAsync.mockResolvedValue(true);
    mockSignInAsync.mockResolvedValue({ identityToken: 'apple-identity-token' });
    mockSignInWithApple.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAppleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(mockSignInAsync).toHaveBeenCalledWith(
      expect.objectContaining({ nonce: 'hashed-nonce' }),
    );
    expect(mockSignInWithApple).toHaveBeenCalledWith({
      identityToken: 'apple-identity-token',
      nonce: 'raw-nonce',
    });
    expect(result.current.error).toBeNull();
  });

  it('ignoriert einen abgebrochenen Dialog ohne Fehlermeldung', async () => {
    mockIsAvailableAsync.mockResolvedValue(true);
    mockSignInAsync.mockRejectedValue({ code: 'ERR_REQUEST_CANCELED' });

    const { result } = renderHook(() => useAppleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error).toBeNull();
    expect(mockSignInWithApple).not.toHaveBeenCalled();
  });

  it('meldet einen Fehler vom AuthService', async () => {
    mockIsAvailableAsync.mockResolvedValue(true);
    mockSignInAsync.mockResolvedValue({ identityToken: 'apple-identity-token' });
    mockSignInWithApple.mockRejectedValue({
      code: 'AUTH_INVALID_CREDENTIALS',
      messageKey: 'x',
      message: 'E-Mail oder Passwort ist falsch.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useAppleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error?.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  it('meldet einen generischen Fehler, wenn kein Identity-Token zurückkommt', async () => {
    mockIsAvailableAsync.mockResolvedValue(true);
    mockSignInAsync.mockResolvedValue({ identityToken: null });

    const { result } = renderHook(() => useAppleSignIn());

    await act(async () => {
      await result.current.signIn();
    });

    expect(result.current.error?.code).toBe('AUTH_APPLE_SIGN_IN_FAILED');
    expect(mockSignInWithApple).not.toHaveBeenCalled();
  });
});
