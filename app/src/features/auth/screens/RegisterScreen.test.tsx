import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { RegisterScreen } from './RegisterScreen';

const mockRegister = jest.fn();

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ register: mockRegister, loading: false, error: null }),
}));

function renderRegisterScreen() {
  const navigate = jest.fn();
  const navigation = { navigate } as unknown as Parameters<typeof RegisterScreen>[0]['navigation'];
  const route = {} as unknown as Parameters<typeof RegisterScreen>[0]['route'];

  render(<RegisterScreen navigation={navigation} route={route} />);

  return { navigate };
}

function fillValidForm() {
  fireEvent.changeText(screen.getByPlaceholderText('Dein Anzeigename'), 'Nutzer');
  fireEvent.changeText(screen.getByPlaceholderText('du@beispiel.de'), 'nutzer@beispiel.de');
  fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[0], 'geheim123');
  fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[1], 'geheim123');
}

describe('RegisterScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('zeigt Validierungsfehler bei ungültigen Eingaben und ruft register() nicht auf', () => {
    renderRegisterScreen();

    fireEvent.press(screen.getByText('Registrieren'));

    expect(screen.getByText('Bitte gib eine gültige E-Mail-Adresse ein.')).toBeTruthy();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('ruft register() mit gültigen Eingaben auf', () => {
    mockRegister.mockResolvedValue(false);
    renderRegisterScreen();

    fillValidForm();
    fireEvent.press(screen.getByText('Registrieren'));

    expect(mockRegister).toHaveBeenCalledWith({
      username: 'Nutzer',
      email: 'nutzer@beispiel.de',
      password: 'geheim123',
    });
  });

  // ADR-002: Registrierung erzeugt sofort eine nutzbare (zunächst anonyme) Session — der
  // RootNavigator wechselt dafür selbstständig anhand der Session in die Haupt-App (nicht Aufgabe
  // von RegisterScreen). Die verbleibende Aufgabe hier ist ausschließlich der Hinweis, die E-Mail zu
  // bestätigen — über `Alert.alert`, da diese Komponente durch den Navigator-Wechsel bereits
  // unmountet sein kann, bevor lokaler State dafür noch rendern würde.
  it('zeigt einen Bestätigungs-Hinweis per Alert, wenn die Registrierung erfolgreich war', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    mockRegister.mockResolvedValue(true);
    renderRegisterScreen();

    fillValidForm();
    fireEvent.press(screen.getByText('Registrieren'));

    await waitFor(() => expect(alertSpy).toHaveBeenCalled());
    expect(alertSpy.mock.calls[0][0]).toBe('Fast geschafft');
    expect(alertSpy.mock.calls[0][1]).toEqual(expect.stringContaining('nutzer@beispiel.de'));
  });

  it('zeigt keinen Bestätigungs-Hinweis, wenn die Registrierung fehlgeschlagen ist', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    mockRegister.mockResolvedValue(false);
    renderRegisterScreen();

    fillValidForm();
    fireEvent.press(screen.getByText('Registrieren'));

    await waitFor(() => expect(mockRegister).toHaveBeenCalled());
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('navigiert zu Login über den Link', () => {
    const { navigate } = renderRegisterScreen();

    fireEvent.press(screen.getByText('Login'));

    expect(navigate).toHaveBeenCalledWith('Login');
  });
});
