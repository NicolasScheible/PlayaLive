import { render, screen } from '@testing-library/react-native';

import { EventDetailScreen } from './EventDetailScreen';

describe('EventDetailScreen', () => {
  it('zeigt die übergebene Event-ID als Platzhalterinhalt', () => {
    render(
      // @ts-expect-error nur die für den Platzhalter relevanten Props werden im Test gestellt
      <EventDetailScreen route={{ params: { eventId: 'ev-1' } }} />,
    );

    expect(screen.getByText('Event-Details folgen in Kürze.')).toBeTruthy();
    expect(screen.getByText('ev-1')).toBeTruthy();
  });
});
