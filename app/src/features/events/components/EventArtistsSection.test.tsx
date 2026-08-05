import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Artist } from '../../../types/entities';

import { EventArtistsSection } from './EventArtistsSection';

const artist: Artist = {
  id: 'artist-1',
  name: 'DJ Test',
  bio: null,
  image_url: null,
  genres: ['Techno'],
  instagram_url: null,
  spotify_url: null,
  youtube_url: null,
  tiktok_url: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

describe('EventArtistsSection', () => {
  it('zeigt Künstler und navigiert beim Klick', () => {
    const onPressArtist = jest.fn();

    render(<EventArtistsSection artists={[artist]} onPressArtist={onPressArtist} />);

    fireEvent.press(screen.getByText('DJ Test'));

    expect(onPressArtist).toHaveBeenCalledWith('artist-1');
  });

  it('zeigt einen Empty State ohne zugeordnete Künstler', () => {
    render(<EventArtistsSection artists={[]} onPressArtist={jest.fn()} />);

    expect(screen.getByText('Für dieses Event sind keine Künstler angegeben.')).toBeTruthy();
  });
});
