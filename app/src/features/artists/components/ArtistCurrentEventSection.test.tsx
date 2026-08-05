import { fireEvent, render, screen } from '@testing-library/react-native';

import type { EventWithDetails } from '../../../types/entities';

import { ArtistCurrentEventSection } from './ArtistCurrentEventSection';

const location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club' as const,
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

const eventDetail: EventWithDetails = {
  id: 'ev-1',
  location_id: 'loc-1',
  title: 'Opening Party',
  description: null,
  start_time: new Date().toISOString(),
  end_time: null,
  image_url: null,
  is_sponsored: false,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  location,
  artists: [],
};

describe('ArtistCurrentEventSection', () => {
  it('zeigt das aktuell laufende Event mit Location und navigiert beim Klick', () => {
    const onPress = jest.fn();

    render(
      <ArtistCurrentEventSection eventDetail={eventDetail} isLoading={false} onPress={onPress} />,
    );

    expect(screen.getByText('Opening Party')).toBeTruthy();
    expect(screen.getByText('Test Club')).toBeTruthy();

    fireEvent.press(screen.getByText('Opening Party'));

    expect(onPress).toHaveBeenCalledWith('ev-1');
  });

  it('zeigt einen Ladezustand, solange die Event-Details noch geladen werden', () => {
    render(<ArtistCurrentEventSection eventDetail={null} isLoading onPress={jest.fn()} />);

    expect(screen.queryByText('Opening Party')).toBeNull();
  });
});
