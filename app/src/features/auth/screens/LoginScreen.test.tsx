import { fireEvent, render, screen } from '@testing-library/react-native';

import { LoginScreen } from './LoginScreen';

const mockLogin = jest.fn();
const mockAppleSignIn = jest.fn();
const mockGoogleSignIn = jest.fn();
const mockUseAppleSignIn = jest.fn();
const mockUseGoogleSignIn = jest.fn();

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin, loading: false, error: null }),
}));

jest.mock('../hooks/useAppleSignIn', () => ({
  useAppleSignIn: () => mockUseAppleSignIn(),
}));

jest.mock('../hooks/useGoogleSignIn', () => ({
  useGoogleSignIn: () => mockUseGoogleSignIn(),
}));

// `expo-apple-authentication` lädt ein natives Modul, das im Jest-Environment nicht registriert ist —
// analog zu `@react-native-firebase/messaging` in `jest.setup.ts`. Lokaler Mock hier statt global, da
// nur dieser Screen die native Komponente importiert (gleiches Muster wie `expo-location` in
// `useUserLocation.test.ts`).
jest.mock('expo-apple-authentication', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Text } = require('react-native');

  return {
    AppleAuthenticationButton: ({ onPress }: { onPress: () => void }) => (
      <Text onPress={onPress}>Mit Apple anmelden</Text>
    ),
    AppleAuthenticationButtonType: { SIGN_IN: 0 },
    AppleAuthenticationButtonStyle: { WHITE: 0 },
  };
});

function renderLoginScreen() {
  const navigate = jest.fn();
  const navigation = { navigate } as unknown as Parameters<typeof LoginScreen>[0]['navigation'];
  const route = {} as unknown as Parameters<typeof LoginScreen>[0]['route'];

  render(<LoginScreen navigation={navigation} route={route} />);

  return { navigate };
}

describe('LoginScreen', () => {
  beforeEach(() => {
    mockUseAppleSignIn.mockReturnValue({
      isAvailable: false,
      loading: false,
      error: null,
      signIn: mockAppleSignIn,
    });
    mockUseGoogleSignIn.mockReturnValue({
      isConfigured: false,
      loading: false,
      error: null,
      signIn: mockGoogleSignIn,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('zeigt weder Apple- noch Google-Button, wenn beide nicht verfügbar/konfiguriert sind', () => {
    renderLoginScreen();

    expect(screen.queryByText('Mit Apple anmelden')).toBeNull();
    expect(screen.queryByText('Mit Google anmelden')).toBeNull();
  });

  it('zeigt den Apple-Button und ruft signIn beim Tippen auf, wenn verfügbar', () => {
    mockUseAppleSignIn.mockReturnValue({
      isAvailable: true,
      loading: false,
      error: null,
      signIn: mockAppleSignIn,
    });

    renderLoginScreen();

    fireEvent.press(screen.getByText('Mit Apple anmelden'));

    expect(mockAppleSignIn).toHaveBeenCalledTimes(1);
  });

  it('zeigt den Google-Button und ruft signIn beim Tippen auf, wenn konfiguriert', () => {
    mockUseGoogleSignIn.mockReturnValue({
      isConfigured: true,
      loading: false,
      error: null,
      signIn: mockGoogleSignIn,
    });

    renderLoginScreen();

    fireEvent.press(screen.getByText('Mit Google anmelden'));

    expect(mockGoogleSignIn).toHaveBeenCalledTimes(1);
  });

  it('zeigt einen Fehler von der Apple-/Google-Anmeldung', () => {
    mockUseGoogleSignIn.mockReturnValue({
      isConfigured: true,
      loading: false,
      error: {
        code: 'AUTH_GOOGLE_SIGN_IN_FAILED',
        messageKey: 'x',
        message: 'Die Anmeldung mit Google ist fehlgeschlagen. Bitte versuche es erneut.',
        technicalMessage: 'x',
      },
      signIn: mockGoogleSignIn,
    });

    renderLoginScreen();

    expect(
      screen.getByText('Die Anmeldung mit Google ist fehlgeschlagen. Bitte versuche es erneut.'),
    ).toBeTruthy();
  });

  it('zeigt einen Validierungsfehler bei ungültiger E-Mail und ruft login() nicht auf', () => {
    renderLoginScreen();

    fireEvent.changeText(screen.getByPlaceholderText('du@beispiel.de'), 'keine-email');
    fireEvent.press(screen.getByText('Login'));

    expect(screen.getByText('Bitte gib eine gültige E-Mail-Adresse ein.')).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('ruft login() mit gültigen Eingaben auf', () => {
    renderLoginScreen();

    fireEvent.changeText(screen.getByPlaceholderText('du@beispiel.de'), 'nutzer@beispiel.de');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'geheim123');
    fireEvent.press(screen.getByText('Login'));

    expect(mockLogin).toHaveBeenCalledWith('nutzer@beispiel.de', 'geheim123');
  });

  it('navigiert zu Register über den Link', () => {
    const { navigate } = renderLoginScreen();

    fireEvent.press(screen.getByText('Registrieren'));

    expect(navigate).toHaveBeenCalledWith('Register');
  });
});
