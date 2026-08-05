import { fireEvent, render, screen } from '@testing-library/react-native';

import { EventDetailHeader } from './EventDetailHeader';

describe('EventDetailHeader', () => {
  it('zeigt Titel, Datum, Uhrzeit und Kategorie', () => {
    const date = new Date();
    date.setFullYear(2026, 7, 7);
    date.setHours(21, 30, 0, 0);

    render(
      <EventDetailHeader
        imageUrl={null}
        title="Opening Party"
        startTime={date.toISOString()}
        locationCategory="club"
        isFavorited={false}
        onToggleFavorite={jest.fn()}
        onPressBack={jest.fn()}
        onPressShare={jest.fn()}
      />,
    );

    expect(screen.getByText('Opening Party')).toBeTruthy();
    expect(screen.getByText('07.08.2026 · 21:30 · Club')).toBeTruthy();
  });

  it('ruft onPressBack/onPressShare/onToggleFavorite beim Tippen auf', () => {
    const onPressBack = jest.fn();
    const onPressShare = jest.fn();
    const onToggleFavorite = jest.fn();

    render(
      <EventDetailHeader
        imageUrl={null}
        title="Opening Party"
        startTime={new Date().toISOString()}
        locationCategory="bar"
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
      <EventDetailHeader
        imageUrl={null}
        title="Opening Party"
        startTime={new Date().toISOString()}
        locationCategory="club"
        isFavorited
        onToggleFavorite={jest.fn()}
        onPressBack={jest.fn()}
        onPressShare={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Aus Favoriten entfernen')).toBeTruthy();
  });
});
