import { fireEvent, render, screen } from '@testing-library/react-native';

import { SearchResultRow } from './SearchResultRow';

describe('SearchResultRow', () => {
  it('zeigt Titel und Untertitel', () => {
    render(<SearchResultRow title="Test Club" subtitle="Club" onPress={jest.fn()} />);

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Club')).toBeTruthy();
  });

  it('zeigt keinen Untertitel, wenn keiner übergeben wird', () => {
    render(<SearchResultRow title="DJ Test" onPress={jest.fn()} />);

    expect(screen.getByText('DJ Test')).toBeTruthy();
    expect(screen.queryByText('null')).toBeNull();
  });

  it('ruft onPress beim Tippen auf', () => {
    const onPress = jest.fn();
    render(<SearchResultRow title="Test Club" onPress={onPress} />);

    fireEvent.press(screen.getByText('Test Club'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
