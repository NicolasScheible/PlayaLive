import { fireEvent, render, screen } from '@testing-library/react-native';

import { FilterChip } from './FilterChip';

describe('FilterChip', () => {
  it('zeigt das Label und den Selected-Status für aktive Chips', () => {
    render(<FilterChip label="Clubs" active onPress={jest.fn()} />);

    const chip = screen.getByText('Clubs');
    expect(chip).toBeTruthy();
    expect(screen.getByRole('button', { selected: true })).toBeTruthy();
  });

  it('ruft onPress beim Tippen auf', () => {
    const onPress = jest.fn();
    render(<FilterChip label="Clubs" active={false} onPress={onPress} />);

    fireEvent.press(screen.getByText('Clubs'));

    expect(onPress).toHaveBeenCalled();
  });
});
