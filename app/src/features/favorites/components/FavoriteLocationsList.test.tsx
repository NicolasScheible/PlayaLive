import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Location } from '../../../types/entities';

import { FavoriteLocationsList } from './FavoriteLocationsList';

const location: Location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club',
  address: null,
  latitude: null,
  longitude: null,
  opening_hours: null,
  images: [],
  is_sponsored: false,
  sponsored_until: null,
  owner_user_id: null,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

describe('FavoriteLocationsList', () => {
  it('zeigt favorisierte Locations und navigiert beim Klick', () => {
    const onPressLocation = jest.fn();

    render(
      <FavoriteLocationsList
        locations={[location]}
        isLoading={false}
        isError={false}
        error={null}
        onPressLocation={onPressLocation}
        onRemove={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('Test Club'));

    expect(onPressLocation).toHaveBeenCalledWith('loc-1');
  });

  it('entfernt eine Location über den Favoriten-Button', () => {
    const onRemove = jest.fn();

    render(
      <FavoriteLocationsList
        locations={[location]}
        isLoading={false}
        isError={false}
        error={null}
        onPressLocation={jest.fn()}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(screen.getByLabelText('Aus Favoriten entfernen'));

    expect(onRemove).toHaveBeenCalledWith('loc-1');
  });

  it('zeigt einen Empty State ohne favorisierte Locations', () => {
    render(
      <FavoriteLocationsList
        locations={[]}
        isLoading={false}
        isError={false}
        error={null}
        onPressLocation={jest.fn()}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByText('Du hast noch keine Locations favorisiert.')).toBeTruthy();
  });
});
