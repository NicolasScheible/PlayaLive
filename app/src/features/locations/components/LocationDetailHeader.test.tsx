import { fireEvent, render, screen } from '@testing-library/react-native';

import { LocationDetailHeader } from './LocationDetailHeader';

describe('LocationDetailHeader', () => {
  it('zeigt Kategorie, Distanz und Auslastung', () => {
    render(
      <LocationDetailHeader
        imageUrl={null}
        locationName="Test Club"
        category="club"
        occupancyLevel="high"
        isOccupancyConfident
        distanceMeters={350}
        isFavorited={false}
        onToggleFavorite={jest.fn()}
        onPressBack={jest.fn()}
        onPressShare={jest.fn()}
      />,
    );

    expect(screen.getByText('Club')).toBeTruthy();
    expect(screen.getByText(/350 m/)).toBeTruthy();
    expect(screen.getByLabelText('Sehr voll')).toBeTruthy();
  });

  it('ruft onPressBack/onPressShare/onToggleFavorite beim Tippen auf', () => {
    const onPressBack = jest.fn();
    const onPressShare = jest.fn();
    const onToggleFavorite = jest.fn();

    render(
      <LocationDetailHeader
        imageUrl={null}
        locationName="Test Club"
        category="bar"
        occupancyLevel={null}
        isOccupancyConfident={false}
        distanceMeters={null}
        isFavorited={false}
        onToggleFavorite={onToggleFavorite}
        onPressBack={onPressBack}
        onPressShare={onPressShare}
      />,
    );

    fireEvent.press(screen.getByLabelText('Zurück'));
    fireEvent.press(screen.getByLabelText('Teilen'));
    fireEvent.press(screen.getByLabelText('Zu Favoriten hinzufügen'));

    expect(onPressBack).toHaveBeenCalledTimes(1);
    expect(onPressShare).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('zeigt das Favoriten-Label passend zum aktuellen Zustand', () => {
    render(
      <LocationDetailHeader
        imageUrl={null}
        locationName="Test Club"
        category="club"
        occupancyLevel={null}
        isOccupancyConfident={false}
        distanceMeters={null}
        isFavorited
        onToggleFavorite={jest.fn()}
        onPressBack={jest.fn()}
        onPressShare={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Aus Favoriten entfernen')).toBeTruthy();
  });
});
