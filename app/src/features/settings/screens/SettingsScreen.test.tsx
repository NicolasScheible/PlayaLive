import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';

import { SettingsScreen } from './SettingsScreen';

const mockNavigate = jest.fn();
const mockUseSettingsScreen = jest.fn();
const mockUseNotificationSettings = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../hooks/useSettingsScreen', () => ({
  useSettingsScreen: () => mockUseSettingsScreen(),
}));

jest.mock('../hooks/useNotificationSettings', () => ({
  useNotificationSettings: () => mockUseNotificationSettings(),
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSettingsScreen.mockReturnValue({
      email: 'dj@example.com',
      isEmailVerified: true,
    });
    mockUseNotificationSettings.mockReturnValue({
      enabled: false,
      permissionStatus: 'undetermined',
      isSaving: false,
      error: null,
      toggle: jest.fn(),
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

  it('ruft toggle() aus useNotificationSettings beim Umschalten von Benachrichtigungen auf', () => {
    const toggle = jest.fn();
    mockUseNotificationSettings.mockReturnValue({
      enabled: false,
      permissionStatus: 'undetermined',
      isSaving: false,
      error: null,
      toggle,
    });

    render(<SettingsScreen />);

    fireEvent(screen.getByLabelText('Benachrichtigungen'), 'valueChange', true);

    expect(toggle).toHaveBeenCalledWith(true);
  });

  it('zeigt bei verweigerter Push-Berechtigung einen Hinweis und öffnet die Systemeinstellungen', () => {
    const openSettingsSpy = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    mockUseNotificationSettings.mockReturnValue({
      enabled: false,
      permissionStatus: 'denied',
      isSaving: false,
      error: null,
      toggle: jest.fn(),
    });

    render(<SettingsScreen />);

    expect(screen.getByText('In den Einstellungen erlauben')).toBeTruthy();

    fireEvent.press(screen.getByText('In den Einstellungen erlauben'));

    expect(openSettingsSpy).toHaveBeenCalledTimes(1);
  });
});
