import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Event, HappyHour, Location, Special } from '../../../types/entities';

import { LocationBottomSheetContent } from './LocationBottomSheetContent';

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

describe('LocationBottomSheetContent', () => {
  it('zeigt Name, Kategorie, Entfernung und Auslastung', () => {
    render(
      <LocationBottomSheetContent
        location={location}
        liveStatus={{
          location_id: 'loc-1',
          occupancy_level: 'high',
          report_count: 3,
          is_confident: true,
          wait_time_minutes: 10,
          last_reported_at: null,
        }}
        activeHappyHours={[]}
        activeSpecials={[]}
        currentEvents={[]}
        distanceMeters={350}
        onPressDetails={jest.fn()}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Club · 350 m')).toBeTruthy();
    expect(screen.getByLabelText('Sehr voll')).toBeTruthy();
  });

  it('zeigt Happy Hours, Specials und aktuelle Events, wenn vorhanden', () => {
    const happyHour: HappyHour = {
      id: 'hh-1',
      location_id: 'loc-1',
      title: 'Cocktail Happy Hour',
      description: null,
      weekday: 'friday',
      start_time: '18:00:00',
      end_time: '20:00:00',
      offer_text: '2 für 1',
      is_sponsored: false,
      priority: 0,
      is_active: true,
      created_by: null,
      created_at: '',
      updated_at: '',
    };
    const special: Special = {
      id: 'sp-1',
      location_id: 'loc-1',
      title: 'Ladies Night',
      description: null,
      image_url: null,
      category: null,
      start_date: '2026-08-04',
      end_date: null,
      start_time: null,
      end_time: null,
      is_recurring: false,
      is_sponsored: false,
      priority: 0,
      is_active: true,
      created_by: null,
      created_at: '',
      updated_at: '',
    };
    const event: Event = {
      id: 'ev-1',
      location_id: 'loc-1',
      title: 'DJ Set',
      description: null,
      start_time: new Date().toISOString(),
      end_time: null,
      image_url: null,
      is_sponsored: false,
      created_by: null,
      created_at: '',
      updated_at: '',
      deleted_at: null,
    };

    render(
      <LocationBottomSheetContent
        location={location}
        liveStatus={null}
        activeHappyHours={[happyHour]}
        activeSpecials={[special]}
        currentEvents={[event]}
        distanceMeters={null}
        onPressDetails={jest.fn()}
      />,
    );

    expect(screen.getByText('HAPPY HOURS')).toBeTruthy();
    expect(screen.getByText('SPECIALS')).toBeTruthy();
    expect(screen.getByText('SPIELT GERADE')).toBeTruthy();
    expect(screen.getByText('Ladies Night')).toBeTruthy();
    expect(screen.getByText('DJ Set')).toBeTruthy();
  });

  it('blendet leere Sections aus und ruft onPressDetails auf', () => {
    const onPressDetails = jest.fn();

    render(
      <LocationBottomSheetContent
        location={location}
        liveStatus={null}
        activeHappyHours={[]}
        activeSpecials={[]}
        currentEvents={[]}
        distanceMeters={null}
        onPressDetails={onPressDetails}
      />,
    );

    expect(screen.queryByText('HAPPY HOURS')).toBeNull();

    fireEvent.press(screen.getByText('Details'));

    expect(onPressDetails).toHaveBeenCalledTimes(1);
  });
});
