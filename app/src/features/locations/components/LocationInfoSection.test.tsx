import { render, screen } from '@testing-library/react-native';

import { LocationInfoSection } from './LocationInfoSection';

describe('LocationInfoSection', () => {
  it('zeigt Name, Beschreibung und Adresse', () => {
    render(
      <LocationInfoSection
        name="Test Club"
        description="Der beste Club der Playa."
        address="Carrer de la Festa 1"
        openingHours={null}
        isOpen={false}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Der beste Club der Playa.')).toBeTruthy();
    expect(screen.getByText('Carrer de la Festa 1')).toBeTruthy();
  });

  it('zeigt den Geöffnet-Status', () => {
    render(
      <LocationInfoSection
        name="Test Club"
        description={null}
        address={null}
        openingHours={null}
        isOpen
      />,
    );

    expect(screen.getByLabelText('Geöffnet')).toBeTruthy();
  });

  it('zeigt den Geschlossen-Status und die Wochenübersicht', () => {
    render(
      <LocationInfoSection
        name="Test Club"
        description={null}
        address={null}
        openingHours={{
          monday: null,
          tuesday: null,
          wednesday: null,
          thursday: { open: '23:00', close: '05:00' },
          friday: { open: '23:00', close: '06:00' },
          saturday: { open: '23:00', close: '06:00' },
          sunday: null,
        }}
        isOpen={false}
      />,
    );

    expect(screen.getByLabelText('Geschlossen')).toBeTruthy();
    expect(screen.getByText('Donnerstag')).toBeTruthy();
    expect(screen.getByText('23:00–05:00')).toBeTruthy();
  });
});
