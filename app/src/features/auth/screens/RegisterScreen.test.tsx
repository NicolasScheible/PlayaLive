import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

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

  // Kernfall des Bugfixes: Supabase liefert bei aktivierter E-Mail-Bestätigung erfolgreich, aber
  // ohne Session — ohne diesen Zustand bliebe die Registrierung ohne jede sichtbare Rückmeldung
  // stehen (siehe AuthService.signUpWithPassword).
  it('zeigt den Bestätigungs-Hinweis, wenn eine E-Mail-Bestätigung aussteht', async () => {
    mockRegister.mockResolvedValue(true);
    renderRegisterScreen();

    fillValidForm();
    fireEvent.press(screen.getByText('Registrieren'));

    await waitFor(() => expect(screen.getByText('Fast geschafft')).toBeTruthy());
    expect(screen.getByText(/nutzer@beispiel\.de/)).toBeTruthy();
  });

  it('navigiert vom Bestätigungs-Hinweis zurück zum Login', async () => {
    mockRegister.mockResolvedValue(true);
    const { navigate } = renderRegisterScreen();

    fillValidForm();
    fireEvent.press(screen.getByText('Registrieren'));

    await waitFor(() => expect(screen.getByText('Fast geschafft')).toBeTruthy());
    fireEvent.press(screen.getByText('Zurück zum Login'));

    expect(navigate).toHaveBeenCalledWith('Login');
  });

  it('navigiert zu Login über den Link', () => {
    const { navigate } = renderRegisterScreen();

    fireEvent.press(screen.getByText('Login'));

    expect(navigate).toHaveBeenCalledWith('Login');
  });
});
