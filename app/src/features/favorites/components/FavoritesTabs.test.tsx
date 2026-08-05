import { fireEvent, render, screen } from '@testing-library/react-native';

import { FavoritesTabs } from './FavoritesTabs';

describe('FavoritesTabs', () => {
  it('zeigt alle drei Tabs und markiert den aktiven', () => {
    render(<FavoritesTabs activeTab="event" onSelectTab={jest.fn()} />);

    expect(screen.getByText('Locations')).toBeTruthy();
    expect(screen.getByText('Events')).toBeTruthy();
    expect(screen.getByText('Artists')).toBeTruthy();
  });

  it('ruft onSelectTab mit dem gewählten Tab auf', () => {
    const onSelectTab = jest.fn();

    render(<FavoritesTabs activeTab="location" onSelectTab={onSelectTab} />);

    fireEvent.press(screen.getByText('Artists'));

    expect(onSelectTab).toHaveBeenCalledWith('artist');
  });
});
