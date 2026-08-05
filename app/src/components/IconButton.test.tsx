import { fireEvent, render, screen } from '@testing-library/react-native';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('ruft onPress beim Tippen auf', () => {
    const onPress = jest.fn();
    render(<IconButton glyph="←" accessibilityLabel="Zurück" onPress={onPress} />);

    fireEvent.press(screen.getByLabelText('Zurück'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('markiert den aktiven Zustand für Screenreader', () => {
    render(<IconButton glyph="♥" accessibilityLabel="Favorit" onPress={jest.fn()} active />);

    expect(screen.getByRole('button', { selected: true })).toBeTruthy();
  });

  it('markiert standardmäßig keinen aktiven Zustand', () => {
    render(<IconButton glyph="♥" accessibilityLabel="Favorit" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { selected: false })).toBeTruthy();
  });
});
