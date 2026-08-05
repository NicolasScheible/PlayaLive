import { fireEvent, render, screen } from '@testing-library/react-native';

import { SettingsRow } from './SettingsRow';

describe('SettingsRow', () => {
  it('zeigt Label und Wert', () => {
    render(<SettingsRow label="Sprache" value="Deutsch" />);

    expect(screen.getByText('Sprache')).toBeTruthy();
    expect(screen.getByText('Deutsch')).toBeTruthy();
  });

  it('ruft onPress beim Tippen auf, wenn navigierbar', () => {
    const onPress = jest.fn();

    render(<SettingsRow label="Profil bearbeiten" onPress={onPress} />);

    fireEvent.press(screen.getByText('Profil bearbeiten'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ist ohne onPress nicht tappbar', () => {
    render(<SettingsRow label="Dark Mode" value="Aktiv" />);

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('zeigt einen Switch, wenn toggle übergeben wird, und ruft onValueChange auf', () => {
    const onValueChange = jest.fn();

    render(<SettingsRow label="Benachrichtigungen" toggle={{ value: false, onValueChange }} />);

    fireEvent(screen.getByLabelText('Benachrichtigungen'), 'valueChange', true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
