import { fireEvent, render, screen } from '@testing-library/react-native';

import { ArtistDetailHeader } from './ArtistDetailHeader';

describe('ArtistDetailHeader', () => {
  it('zeigt Name und Genres', () => {
    render(
      <ArtistDetailHeader
        imageUrl={null}
        name="DJ Test"
        genres={['Techno', 'House']}
        isFavorited={false}
        onToggleFavorite={jest.fn()}
        onPressBack={jest.fn()}
        onPressShare={jest.fn()}
      />,
    );

    expect(screen.getByText('DJ Test')).toBeTruthy();
    expect(screen.getByText('Techno, House')).toBeTruthy();
  });

  it('zeigt keine Genre-Zeile, wenn keine Genres vorhanden sind', () => {
    render(
      <ArtistDetailHeader
        imageUrl={null}
        name="DJ Test"
        genres={[]}
        isFavorited={false}
        onToggleFavorite={jest.fn()}
        onPressBack={jest.fn()}
        onPressShare={jest.fn()}
      />,
    );

    expect(screen.queryByText('Techno')).toBeNull();
  });

  it('ruft onPressBack/onPressShare/onToggleFavorite beim Tippen auf', () => {
    const onPressBack = jest.fn();
    const onPressShare = jest.fn();
    const onToggleFavorite = jest.fn();

    render(
      <ArtistDetailHeader
        imageUrl={null}
        name="DJ Test"
        genres={[]}
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
      <ArtistDetailHeader
        imageUrl={null}
        name="DJ Test"
        genres={[]}
        isFavorited
        onToggleFavorite={jest.fn()}
        onPressBack={jest.fn()}
        onPressShare={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Aus Favoriten entfernen')).toBeTruthy();
  });
});
