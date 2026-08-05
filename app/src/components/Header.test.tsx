import { fireEvent, render, screen } from '@testing-library/react-native';

import { Header } from './Header';

describe('Header', () => {
  it('zeigt die Wortmarke „PlayaLive"', () => {
    render(<Header />);

    expect(screen.getByLabelText('PlayaLive')).toBeTruthy();
  });

  it('zeigt ohne onPressMenu keinen Menü-Button', () => {
    render(<Header />);

    expect(screen.queryByLabelText('Menü öffnen')).toBeNull();
  });

  it('zeigt mit onPressMenu einen Menü-Button und ruft ihn beim Tippen auf', () => {
    const onPressMenu = jest.fn();

    render(<Header onPressMenu={onPressMenu} />);

    fireEvent.press(screen.getByLabelText('Menü öffnen'));

    expect(onPressMenu).toHaveBeenCalledTimes(1);
  });
});
