import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Location } from '../../../types/entities';

import { EventLocationSection } from './EventLocationSection';

const location: Location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club',
  address: null,
  latitude: 39.5,
  longitude: 2.6,
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

describe('EventLocationSection', () => {
  it('zeigt die Location mit Auslastung', () => {
    render(
      <EventLocationSection
        location={location}
        liveStatus={{
          location_id: 'loc-1',
          occupancy_level: 'high',
          report_count: 2,
          is_confident: true,
          wait_time_minutes: 15,
          last_reported_at: null,
        }}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByLabelText('Sehr voll')).toBeTruthy();
  });

  it('navigiert beim Tippen auf die Location', () => {
    const onPress = jest.fn();

    render(<EventLocationSection location={location} liveStatus={null} onPress={onPress} />);

    fireEvent.press(screen.getByText('Test Club'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
