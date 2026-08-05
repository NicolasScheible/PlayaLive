import { fireEvent, render, screen } from '@testing-library/react-native';

import type { EventWithLiveFlag } from '../hooks/useLocationTodayEvents';

import { LocationTodayEventsSection } from './LocationTodayEventsSection';

const event: EventWithLiveFlag = {
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
  isLive: true,
};

describe('LocationTodayEventsSection', () => {
  it('zeigt heutige Events und navigiert beim Klick', () => {
    const onPressEvent = jest.fn();

    render(
      <LocationTodayEventsSection
        locationName="Test Club"
        events={[event]}
        isLoading={false}
        isError={false}
        error={null}
        onPressEvent={onPressEvent}
      />,
    );

    fireEvent.press(screen.getByText('Opening Party'));

    expect(onPressEvent).toHaveBeenCalledWith('ev-1');
  });

  it('zeigt einen Empty State ohne heutige Events', () => {
    render(
      <LocationTodayEventsSection
        locationName="Test Club"
        events={[]}
        isLoading={false}
        isError={false}
        error={null}
        onPressEvent={jest.fn()}
      />,
    );

    expect(screen.getByText('Heute finden keine Events statt.')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <LocationTodayEventsSection
        locationName="Test Club"
        events={[]}
        isLoading={false}
        isError
        error={{
          code: 'ERR',
          messageKey: 'x',
          message: 'Fehler beim Laden',
          technicalMessage: 'x',
        }}
        onPressEvent={jest.fn()}
      />,
    );

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });
});
