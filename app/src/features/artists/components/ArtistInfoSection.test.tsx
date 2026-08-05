import { fireEvent, render, screen } from '@testing-library/react-native';

import { ArtistInfoSection } from './ArtistInfoSection';

describe('ArtistInfoSection', () => {
  it('zeigt Biografie und Genres', () => {
    render(
      <ArtistInfoSection
        bio="Seit 10 Jahren auf der Playa unterwegs."
        genres={['Techno', 'House']}
        instagramUrl={null}
        spotifyUrl={null}
        youtubeUrl={null}
        tiktokUrl={null}
        onPressLink={jest.fn()}
      />,
    );

    expect(screen.getByText('Seit 10 Jahren auf der Playa unterwegs.')).toBeTruthy();
    expect(screen.getByText('Techno, House')).toBeTruthy();
  });

  it('zeigt weder Biografie- noch Genre-Zeile, wenn keine Daten vorhanden sind', () => {
    render(
      <ArtistInfoSection
        bio={null}
        genres={[]}
        instagramUrl={null}
        spotifyUrl={null}
        youtubeUrl={null}
        tiktokUrl={null}
        onPressLink={jest.fn()}
      />,
    );

    expect(screen.queryByText('Genres')).toBeNull();
  });

  it('zeigt nur die tatsächlich gesetzten Social Links', () => {
    render(
      <ArtistInfoSection
        bio={null}
        genres={[]}
        instagramUrl="https://instagram.com/djtest"
        spotifyUrl={null}
        youtubeUrl="https://youtube.com/djtest"
        tiktokUrl={null}
        onPressLink={jest.fn()}
      />,
    );

    expect(screen.getByText('Instagram')).toBeTruthy();
    expect(screen.getByText('YouTube')).toBeTruthy();
    expect(screen.queryByText('Spotify')).toBeNull();
    expect(screen.queryByText('TikTok')).toBeNull();
  });

  it('ruft onPressLink mit der jeweiligen URL auf', () => {
    const onPressLink = jest.fn();

    render(
      <ArtistInfoSection
        bio={null}
        genres={[]}
        instagramUrl="https://instagram.com/djtest"
        spotifyUrl={null}
        youtubeUrl={null}
        tiktokUrl={null}
        onPressLink={onPressLink}
      />,
    );

    fireEvent.press(screen.getByText('Instagram'));

    expect(onPressLink).toHaveBeenCalledWith('https://instagram.com/djtest');
  });
});
