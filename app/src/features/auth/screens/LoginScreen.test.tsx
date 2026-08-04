import { fireEvent, render, screen } from '@testing-library/react-native';

import { LoginScreen } from './LoginScreen';

const mockLogin = jest.fn();

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin, loading: false, error: null }),
}));

function renderLoginScreen() {
  const navigate = jest.fn();
  const navigation = { navigate } as unknown as Parameters<typeof LoginScreen>[0]['navigation'];
  const route = {} as unknown as Parameters<typeof LoginScreen>[0]['route'];

  render(<LoginScreen navigation={navigation} route={route} />);

  return { navigate };
}

describe('LoginScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
