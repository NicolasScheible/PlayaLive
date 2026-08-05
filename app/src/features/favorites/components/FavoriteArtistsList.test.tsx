import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Artist } from '../../../types/entities';

import { FavoriteArtistsList } from './FavoriteArtistsList';

const artist: Artist = {
  id: 'artist-1',
  name: 'DJ Test',
  bio: null,
  image_url: null,
  genres: [],
  instagram_url: null,
  spotify_url: null,
  youtube_url: null,
  tiktok_url: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

describe('FavoriteArtistsList', () => {
  it('zeigt favorisierte Artists und navigiert beim Klick', () => {
    const onPressArtist = jest.fn();

    render(
      <FavoriteArtistsList
        artists={[artist]}
        isLoading={false}
        isError={false}
        error={null}
        onPressArtist={onPressArtist}
        onRemove={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('DJ Test'));

    expect(onPressArtist).toHaveBeenCalledWith('artist-1');
  });

  it('entfernt einen Artist über den Favoriten-Button', () => {
    const onRemove = jest.fn();

    render(
      <FavoriteArtistsList
        artists={[artist]}
        isLoading={false}
        isError={false}
        error={null}
        onPressArtist={jest.fn()}
        onRemove={onRemove}
      />,
    );

    fireEvent.press(screen.getByLabelText('Aus Favoriten entfernen'));

    expect(onRemove).toHaveBeenCalledWith('artist-1');
  });

  it('zeigt einen Empty State ohne favorisierte Artists', () => {
    render(
      <FavoriteArtistsList
        artists={[]}
        isLoading={false}
        isError={false}
        error={null}
        onPressArtist={jest.fn()}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByText('Du hast noch keine Künstler favorisiert.')).toBeTruthy();
  });
});
