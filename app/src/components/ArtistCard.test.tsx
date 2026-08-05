import { render, screen } from '@testing-library/react-native';

import { ArtistCard } from './ArtistCard';

describe('ArtistCard', () => {
  it('zeigt Name und Genres', () => {
    render(<ArtistCard name="DJ Test" imageUrl={null} genres={['Techno', 'House']} />);

    expect(screen.getByText('DJ Test')).toBeTruthy();
    expect(screen.getByText('Techno, House')).toBeTruthy();
  });

  it('zeigt keine Genre-Zeile ohne Genres', () => {
    render(<ArtistCard name="DJ Test" imageUrl={null} genres={[]} />);

    expect(screen.queryByText(/Techno/)).toBeNull();
  });

  it('ist für Screenreader über den Namen zugänglich', () => {
    render(<ArtistCard name="DJ Test" imageUrl={null} genres={[]} />);

    expect(screen.getByLabelText('DJ Test')).toBeTruthy();
  });
});
