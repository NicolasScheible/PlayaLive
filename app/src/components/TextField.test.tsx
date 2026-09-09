import { fireEvent, render, screen } from '@testing-library/react-native';

import { TextField } from './TextField';

describe('TextField', () => {
  it('zeigt bei einem normalen Feld keinen Sichtbarkeits-Umschalter', () => {
    render(<TextField label="E-Mail" value="" onChangeText={jest.fn()} />);

    expect(screen.queryByLabelText('Passwort anzeigen')).toBeNull();
  });

  it('zeigt bei einem Passwortfeld einen Umschalter und verbirgt den Wert standardmäßig', () => {
    render(<TextField label="Passwort" value="geheim" onChangeText={jest.fn()} secureTextEntry />);

    expect(screen.getByDisplayValue('geheim').props.secureTextEntry).toBe(true);
    expect(screen.getByLabelText('Passwort anzeigen')).toBeTruthy();
  });

  it('zeigt den Passwort-Klartext nach Tippen auf „Anzeigen" und verbirgt ihn danach wieder', () => {
    render(<TextField label="Passwort" value="geheim" onChangeText={jest.fn()} secureTextEntry />);

    fireEvent.press(screen.getByLabelText('Passwort anzeigen'));

    expect(screen.getByDisplayValue('geheim').props.secureTextEntry).toBe(false);
    expect(screen.getByLabelText('Passwort verbergen')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Passwort verbergen'));

    expect(screen.getByDisplayValue('geheim').props.secureTextEntry).toBe(true);
  });
});
