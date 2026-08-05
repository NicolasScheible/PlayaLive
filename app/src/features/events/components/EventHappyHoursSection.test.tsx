import { render, screen } from '@testing-library/react-native';

import type { HappyHour } from '../../../types/entities';

import { EventHappyHoursSection } from './EventHappyHoursSection';

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

describe('EventHappyHoursSection', () => {
  it('zeigt aktive Happy Hours der Location', () => {
    render(
      <EventHappyHoursSection
        locationName="Test Club"
        happyHours={[happyHour]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('2 für 1')).toBeTruthy();
  });

  it('zeigt einen Empty State ohne Happy Hours', () => {
    render(
      <EventHappyHoursSection
        locationName="Test Club"
        happyHours={[]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('Aktuell sind keine Happy Hours eingetragen.')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <EventHappyHoursSection
        locationName="Test Club"
        happyHours={[]}
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
