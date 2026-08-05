import { render, screen } from '@testing-library/react-native';

import type { Special } from '../../../types/entities';

import { EventSpecialsSection } from './EventSpecialsSection';

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

describe('EventSpecialsSection', () => {
  it('zeigt aktive Specials der Location', () => {
    render(
      <EventSpecialsSection
        locationName="Test Club"
        specials={[special]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('Ladies Night')).toBeTruthy();
  });

  it('zeigt einen Empty State ohne Specials', () => {
    render(
      <EventSpecialsSection
        locationName="Test Club"
        specials={[]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('Aktuell sind keine Specials eingetragen.')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <EventSpecialsSection
        locationName="Test Club"
        specials={[]}
        isLoading={false}
        isError
        error={{
          code: 'ERR',
          messageKey: 'x',
          message: 'Fehler beim Laden',
          technicalMessage: 'x',
        }}
      />,
    );

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });
});
