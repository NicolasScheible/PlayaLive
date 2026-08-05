import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking, Share } from 'react-native';

import { ArtistDetailScreen } from './ArtistDetailScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockUseArtistDetailScreen = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('../hooks/useArtistDetailScreen', () => ({
  useArtistDetailScreen: (artistId: string) => mockUseArtistDetailScreen(artistId),
}));

const artist = {
  id: 'artist-1',
  name: 'DJ Test',
  bio: 'Seit 10 Jahren auf der Playa unterwegs.',
  image_url: null,
  genres: ['Techno'],
  instagram_url: 'https://instagram.com/djtest',
  spotify_url: null,
  youtube_url: null,
  tiktok_url: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

const upcomingEvent = {
  id: 'ev-upcoming',
  location_id: 'loc-1',
  title: 'Closing Party',
  description: null,
  start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  end_time: null,
  image_url: null,
  is_sponsored: false,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  locationName: 'Test Club',
};

const baseResult = {
  artist,
  isLoading: false,
  isError: false,
  error: null,
  notFound: false,
  upcomingEvents: [upcomingEvent],
  isEventsLoading: false,
  isEventsError: false,
  eventsError: null,
  currentEventDetail: { eventDetail: null, isLoading: false, isError: false, error: null },
  favorite: {
    isFavorited: false,
    toggleFavorite: jest.fn(),
    isLoading: false,
    isToggling: false,
    error: null,
  },
};

// `navigation`/weitere Stack-Props sind für den Screen selbst irrelevant (er nutzt ausschließlich
// `useNavigation()` und `route.params.artistId`) — nur `route` wird für die Tests benötigt.
function renderScreen(artistId = 'artist-1') {
  const props = { route: { params: { artistId } } } as unknown as Parameters<
    typeof ArtistDetailScreen
  >[0];

  return render(<ArtistDetailScreen {...props} />);
}

describe('ArtistDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseArtistDetailScreen.mockReturnValue(baseResult);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.dismissedAction });
  });

  it('zeigt den Ladezustand', () => {
    mockUseArtistDetailScreen.mockReturnValue({ ...baseResult, isLoading: true });

    renderScreen();

    expect(screen.getByText('Künstler wird geladen')).toBeTruthy();
  });

  it('zeigt den Fehlerzustand', () => {
    mockUseArtistDetailScreen.mockReturnValue({
      ...baseResult,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Fehler beim Laden', technicalMessage: 'x' },
    });

    renderScreen();

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });

  it('zeigt einen Empty State, wenn der Künstler nicht gefunden wurde', () => {
    mockUseArtistDetailScreen.mockReturnValue({ ...baseResult, notFound: true, artist: null });

    renderScreen();

    expect(screen.getByText('Dieser Künstler wurde nicht gefunden.')).toBeTruthy();
  });

  it('zeigt Name, Biografie, Genres und kommende Events', () => {
    renderScreen();

    expect(screen.getAllByText('DJ Test').length).toBeGreaterThan(0);
    expect(screen.getByText('Seit 10 Jahren auf der Playa unterwegs.')).toBeTruthy();
    expect(screen.getByText('Closing Party')).toBeTruthy();
  });

  it('zeigt keinen „Aktueller Auftritt"-Bereich, wenn kein Event aktuell läuft', () => {
    renderScreen();

    expect(screen.queryByText('AKTUELLER AUFTRITT')).toBeNull();
  });

  it('zeigt den „Aktueller Auftritt"-Bereich mit Event und Location', () => {
    const currentEvent = {
      id: 'ev-current',
      title: 'Opening Party',
      start_time: new Date().toISOString(),
      end_time: null,
      image_url: null,
      location: { id: 'loc-1', name: 'Test Club' },
      artists: [artist],
    };
    mockUseArtistDetailScreen.mockReturnValue({
      ...baseResult,
      currentEventDetail: {
        eventDetail: currentEvent,
        isLoading: false,
        isError: false,
        error: null,
      },
    });

    renderScreen();

    expect(screen.getByText('AKTUELLER AUFTRITT')).toBeTruthy();
    expect(screen.getByText('Opening Party')).toBeTruthy();
  });

  it('navigiert beim Tippen auf Zurück', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Zurück'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('ruft Share.share beim Tippen auf Teilen auf', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Teilen'));

    expect(Share.share).toHaveBeenCalledWith({ message: 'DJ Test' });
  });

  it('ruft toggleFavorite beim Tippen auf den Favoriten-Button auf', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Zu Favoriten hinzufügen'));

    expect(baseResult.favorite.toggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('öffnet einen Social Link über Linking', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Instagram'));

    expect(Linking.openURL).toHaveBeenCalledWith('https://instagram.com/djtest');
  });

  it('navigiert beim Tippen auf ein kommendes Event zum Event-Detail-Screen', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Closing Party'));

    expect(mockNavigate).toHaveBeenCalledWith('EventDetail', { eventId: 'ev-upcoming' });
  });
});
