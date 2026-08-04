import { render, screen } from '@testing-library/react-native';

import { LocationCard } from './LocationCard';

describe('LocationCard', () => {
  it('zeigt Name und Auslastungs-Badge', () => {
    render(<LocationCard name="Test Club" imageUrl={null} occupancyLevel="high" />);

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByLabelText('Sehr voll')).toBeTruthy();
  });

  it('zeigt die Wartezeit nur, wenn sie übergeben wurde', () => {
    render(
      <LocationCard
        name="Test Club"
        imageUrl={null}
        occupancyLevel="medium"
        waitTimeMinutes={15}
      />,
    );

    expect(screen.getByText('≈ 15 Min. Wartezeit')).toBeTruthy();
  });

  it('zeigt keine Wartezeit ohne Angabe', () => {
    render(<LocationCard name="Test Club" imageUrl={null} occupancyLevel={null} />);

    expect(screen.queryByText(/Wartezeit/)).toBeNull();
  });
});
