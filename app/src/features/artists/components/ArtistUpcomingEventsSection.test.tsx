import { fireEvent, render, screen } from '@testing-library/react-native';

import type { EventWithLocationName } from '../hooks/useArtistEvents';

import { ArtistUpcomingEventsSection } from './ArtistUpcomingEventsSection';

const event: EventWithLocationName = {
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

describe('ArtistUpcomingEventsSection', () => {
  it('zeigt kommende Events und navigiert beim Klick', () => {
    const onPressEvent = jest.fn();

    render(
      <ArtistUpcomingEventsSection
        events={[event]}
        isLoading={false}
        isError={false}
        error={null}
        onPressEvent={onPressEvent}
      />,
    );

    fireEvent.press(screen.getByText('Closing Party'));

    expect(onPressEvent).toHaveBeenCalledWith('ev-1');
  });

  it('zeigt einen Empty State ohne kommende Events', () => {
    render(
      <ArtistUpcomingEventsSection
        events={[]}
        isLoading={false}
        isError={false}
        error={null}
        onPressEvent={jest.fn()}
      />,
    );

    expect(screen.getByText('Aktuell sind keine kommenden Events geplant.')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <ArtistUpcomingEventsSection
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
