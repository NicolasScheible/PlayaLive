import { render, screen } from '@testing-library/react-native';

import { HappyHourCard } from './HappyHourCard';

describe('HappyHourCard', () => {
  it('zeigt Location, Wochentag, Zeitraum und Angebot', () => {
    render(
      <HappyHourCard
        locationName="Test Club"
        weekdayLabel="Freitag"
        startTime="18:00:00"
        endTime="20:00:00"
        offerText="2 für 1 Cocktails"
        imageUrl={null}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Freitag · 18:00–20:00')).toBeTruthy();
    expect(screen.getByText('2 für 1 Cocktails')).toBeTruthy();
  });

  it('zeigt keinen Angebotstext ohne offerText', () => {
    render(
      <HappyHourCard
        locationName="Test Club"
        weekdayLabel="Freitag"
        startTime="18:00:00"
        endTime="20:00:00"
        offerText={null}
        imageUrl={null}
      />,
    );

    expect(screen.queryByText('2 für 1 Cocktails')).toBeNull();
  });
});
