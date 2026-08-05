import { fireEvent, render, screen } from '@testing-library/react-native';

import type { FavoriteEventWithLocationName } from '../hooks/useFavoriteEvents';

import { FavoriteEventsList } from './FavoriteEventsList';

const event: FavoriteEventWithLocationName = {
  id: 'ev-1',
  location_id: 'loc-1',
  title: 'Closing Party',
  description: null,
  start_time: new Date().toISOString(),
  end_time: null,
  image_url: null,
  is_sponsored: false,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  locationName: 'Test Club',
};

describe('FavoriteEventsList', () => {
  it('zeigt favorisierte Events und navigiert beim Klick', () => {
    const onPressEvent = jest.fn();

    render(
      <FavoriteEventsList
        events={[event]}
        isLoading={false}
        isError={false}
        error={null}
        onPressEvent={onPressEvent}
        onRemove={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('Closing Party'));

    expect(onPressEvent).toHaveBeenCalledWith('ev-1');
  });

  it('entfernt ein Event über den Favoriten-Button', () => {
    const onRemove = jest.fn();

    render(
      <FavoriteEventsList
        events={[event]}
        isLoading={false}
        isError={false}
        error={null}
        onPressEvent={jest.fn()}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(screen.getByLabelText('Aus Favoriten entfernen'));

    expect(onRemove).toHaveBeenCalledWith('ev-1');
  });

  it('zeigt einen Empty State ohne favorisierte Events', () => {
    render(
      <FavoriteEventsList
        events={[]}
        isLoading={false}
        isError={false}
        error={null}
        onPressEvent={jest.fn()}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByText('Du hast noch keine Events favorisiert.')).toBeTruthy();
  });
});
