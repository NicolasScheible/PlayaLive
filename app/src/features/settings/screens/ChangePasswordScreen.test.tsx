import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ChangePasswordScreen } from './ChangePasswordScreen';

const mockGoBack = jest.fn();
const mockChangePassword = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('../hooks/useChangePassword', () => ({
  useChangePassword: () => ({
    changePassword: mockChangePassword,
    isSaving: false,
    error: null,
  }),
}));

describe('ChangePasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('zeigt einen Validierungsfehler bei zu kurzem Passwort und ruft changePassword() nicht auf', () => {
    render(<ChangePasswordScreen />);

    fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[0], '123');
    fireEvent.press(screen.getByText('Passwort ändern'));

    expect(screen.getByText('Das Passwort muss mindestens 6 Zeichen lang sein.')).toBeTruthy();
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it('zeigt einen Validierungsfehler bei nicht übereinstimmenden Passwörtern', () => {
    render(<ChangePasswordScreen />);

    const [password, passwordConfirmation] = screen.getAllByPlaceholderText('••••••••');
    fireEvent.changeText(password, 'geheim123');
    fireEvent.changeText(passwordConfirmation, 'anderes123');
    fireEvent.press(screen.getByText('Passwort ändern'));

    expect(screen.getByText('Die Passwörter stimmen nicht überein.')).toBeTruthy();
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it('ruft changePassword() mit gültigen Eingaben auf und navigiert zurück', async () => {
    mockChangePassword.mockResolvedValue(undefined);

    render(<ChangePasswordScreen />);

    const [password, passwordConfirmation] = screen.getAllByPlaceholderText('••••••••');
    fireEvent.changeText(password, 'geheim123');
    fireEvent.changeText(passwordConfirmation, 'geheim123');
    fireEvent.press(screen.getByText('Passwort ändern'));

    await waitFor(() => expect(mockChangePassword).toHaveBeenCalledWith('geheim123'));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
