import { fireEvent, render, screen } from '@testing-library/react-native';

import { GoogleSignInButton } from './GoogleSignInButton';

describe('GoogleSignInButton', () => {
  it('zeigt das Label und ruft onPress beim Tippen auf', () => {
    const onPress = jest.fn();
    render(<GoogleSignInButton onPress={onPress} />);

    fireEvent.press(screen.getByText('Mit Google anmelden'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('zeigt einen Ladeindikator statt Label, wenn loading aktiv ist', () => {
    render(<GoogleSignInButton onPress={jest.fn()} loading />);

    expect(screen.queryByText('Mit Google anmelden')).toBeNull();
  });
});
