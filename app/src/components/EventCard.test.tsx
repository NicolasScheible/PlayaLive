import { render, screen } from '@testing-library/react-native';

import { EventCard } from './EventCard';

describe('EventCard', () => {
  it('zeigt Titel, Location und formatierte Uhrzeit', () => {
    const date = new Date();
    date.setHours(21, 30, 0, 0);

    render(
      <EventCard
        title="Opening Party"
        locationName="Test Club"
        startTime={date.toISOString()}
        imageUrl={null}
      />,
    );

    expect(screen.getByText('Opening Party')).toBeTruthy();
    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('21:30')).toBeTruthy();
  });

  it('zeigt kein LIVE-Badge ohne isLive', () => {
    render(
      <EventCard
        title="Opening Party"
        locationName="Test Club"
        startTime={new Date().toISOString()}
        imageUrl={null}
      />,
    );

    expect(screen.queryByLabelText('Läuft gerade live')).toBeNull();
  });

  it('zeigt das LIVE-Badge, wenn isLive gesetzt ist', () => {
    render(
      <EventCard
        title="Opening Party"
        locationName="Test Club"
        startTime={new Date().toISOString()}
        imageUrl={null}
        isLive
      />,
    );

    expect(screen.getByLabelText('Läuft gerade live')).toBeTruthy();
  });
});
