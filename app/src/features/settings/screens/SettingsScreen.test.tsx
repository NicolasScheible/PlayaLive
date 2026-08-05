import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { SettingsScreen } from './SettingsScreen';

const mockNavigate = jest.fn();
const mockUseSettingsScreen = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../hooks/useSettingsScreen', () => ({
  useSettingsScreen: () => mockUseSettingsScreen(),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSettingsScreen.mockReturnValue({
      email: 'dj@example.com',
      isEmailVerified: true,
    });
  });

  it('zeigt alle Bereiche', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('KONTO')).toBeTruthy();
    expect(screen.getByText('APP')).toBeTruthy();
    expect(screen.getByText('DATENSCHUTZ')).toBeTruthy();
    expect(screen.getByText('SUPPORT')).toBeTruthy();
    expect(screen.getByText('RECHTLICHES')).toBeTruthy();
  });

  it('zeigt die E-Mail-Adresse und den Verifizierungsstatus aus useSettingsScreen', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('dj@example.com')).toBeTruthy();
    expect(screen.getByText('Bestätigt')).toBeTruthy();
  });

  it('zeigt einen unbestätigten Verifizierungsstatus', () => {
    mockUseSettingsScreen.mockReturnValue({ email: 'dj@example.com', isEmailVerified: false });

    render(<SettingsScreen />);

    expect(screen.getByText('Nicht bestätigt')).toBeTruthy();
  });

  it('navigiert bei „Profil bearbeiten" zum ProfileScreen', () => {
    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Profil bearbeiten'));

    expect(mockNavigate).toHaveBeenCalledWith('Profile');
  });

  it('navigiert bei „Passwort ändern" zum ChangePasswordScreen', () => {
    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Passwort ändern'));

    expect(mockNavigate).toHaveBeenCalledWith('ChangePassword');
  });

  it('navigiert bei „Berechtigungen" zum PermissionsScreen', () => {
    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Berechtigungen'));

    expect(mockNavigate).toHaveBeenCalledWith('Permissions');
  });

  it('zeigt einen „Demnächst verfügbar"-Hinweis für noch nicht umgesetzte Einträge', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Konto löschen'));

    expect(alertSpy).toHaveBeenCalledWith(
      'Konto löschen',
      'Diese Funktion ist noch nicht verfügbar.',
    );
  });
});
