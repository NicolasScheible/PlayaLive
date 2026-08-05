import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProfileEditForm } from './ProfileEditForm';

describe('ProfileEditForm', () => {
  it('zeigt den aktuellen Benutzernamen vorausgefüllt', () => {
    render(<ProfileEditForm initialUsername="DJ Test" isSaving={false} onSave={jest.fn()} />);

    expect(screen.getByDisplayValue('DJ Test')).toBeTruthy();
  });

  it('ruft onSave mit dem getrimmten Benutzernamen auf', () => {
    const onSave = jest.fn();

    render(<ProfileEditForm initialUsername="DJ Test" isSaving={false} onSave={onSave} />);

    fireEvent.changeText(screen.getByDisplayValue('DJ Test'), '  Neuer Name  ');
    fireEvent.press(screen.getByText('Speichern'));

    expect(onSave).toHaveBeenCalledWith('Neuer Name');
  });

  it('ruft onSave nicht auf, wenn der Benutzername nur aus Leerzeichen besteht', () => {
    const onSave = jest.fn();

    render(<ProfileEditForm initialUsername="DJ Test" isSaving={false} onSave={onSave} />);

    fireEvent.changeText(screen.getByDisplayValue('DJ Test'), '   ');
    fireEvent.press(screen.getByText('Speichern'));

    expect(onSave).not.toHaveBeenCalled();
  });
});
