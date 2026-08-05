import { render, screen } from '@testing-library/react-native';

import { ArtistDetailScreen } from './ArtistDetailScreen';

describe('ArtistDetailScreen', () => {
  it('zeigt die übergebene Artist-ID als Platzhalterinhalt', () => {
    render(
      // @ts-expect-error nur die für den Platzhalter relevanten Props werden im Test gestellt
      <ArtistDetailScreen route={{ params: { artistId: 'artist-1' } }} />,
    );

    expect(screen.getByText('Künstler-Details folgen in Kürze.')).toBeTruthy();
    expect(screen.getByText('artist-1')).toBeTruthy();
  });
});
