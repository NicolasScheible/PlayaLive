import { render, screen } from '@testing-library/react-native';

import { EventInfoSection } from './EventInfoSection';

describe('EventInfoSection', () => {
  it('zeigt Beschreibung, Beginn, Veranstaltungsort und Distanz', () => {
    const start = new Date();
    start.setFullYear(2026, 7, 7);
    start.setHours(21, 0, 0, 0);

    render(
      <EventInfoSection
        description="Die beste Opening Party der Saison."
        startTime={start.toISOString()}
        endTime={null}
        locationName="Test Club"
        distanceMeters={350}
      />,
    );

    expect(screen.getByText('Die beste Opening Party der Saison.')).toBeTruthy();
    expect(screen.getByText('07.08.2026 · 21:00')).toBeTruthy();
    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('350 m')).toBeTruthy();
  });

  it('zeigt Ende nur, wenn vorhanden', () => {
    const start = new Date();
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

    const { rerender } = render(
      <EventInfoSection
        description={null}
        startTime={start.toISOString()}
        endTime={null}
        locationName="Test Club"
        distanceMeters={null}
      />,
    );

    expect(screen.queryByText('Ende')).toBeNull();

    rerender(
      <EventInfoSection
        description={null}
        startTime={start.toISOString()}
        endTime={end.toISOString()}
        locationName="Test Club"
        distanceMeters={null}
      />,
    );

    expect(screen.getByText('Ende')).toBeTruthy();
  });

  it('zeigt keine Distanz ohne Nutzerstandort', () => {
    render(
      <EventInfoSection
        description={null}
        startTime={new Date().toISOString()}
        endTime={null}
        locationName="Test Club"
        distanceMeters={null}
      />,
    );

    expect(screen.queryByText('Distanz')).toBeNull();
  });
});
