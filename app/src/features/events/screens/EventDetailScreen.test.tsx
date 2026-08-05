import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking, Share } from 'react-native';

import { EventDetailScreen } from './EventDetailScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockUseEventDetailScreen = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('../hooks/useEventDetailScreen', () => ({
  useEventDetailScreen: (eventId: string) => mockUseEventDetailScreen(eventId),
}));

const location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club' as const,
  address: null,
  latitude: 39.5,
  longitude: 2.6,
  opening_hours: null,
  images: [],
  is_sponsored: false,
  sponsored_until: null,
  owner_user_id: null,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

const artist = {
  id: 'artist-1',
  name: 'DJ Test',
  bio: null,
  image_url: null,
  genres: [] as string[],
  instagram_url: null,
  spotify_url: null,
  youtube_url: null,
  tiktok_url: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

const event = {
  id: 'ev-1',
  location_id: 'loc-1',
  title: 'Opening Party',
  description: 'Die beste Opening Party der Saison.',
  start_time: new Date().toISOString(),
  end_time: null,
  image_url: null,
  is_sponsored: false,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  location,
  artists: [artist],
};

const emptySection = { isLoading: false, isError: false, error: null };

const baseResult = {
  event,
  distanceMeters: 350,
  isLoading: false,
  isError: false,
  error: null,
  notFound: false,
  liveStatus: { liveStatus: null, ...emptySection },
  happyHours: { happyHours: [], ...emptySection },
  specials: { specials: [], ...emptySection },
  favorite: {
    isFavorited: false,
    toggleFavorite: jest.fn(),
    isLoading: false,
    isToggling: false,
    error: null,
  },
};

// `navigation`/weitere Stack-Props sind für den Screen selbst irrelevant (er nutzt ausschließlich
// `useNavigation()` und `route.params.eventId`) — nur `route` wird für die Tests benötigt.
function renderScreen(eventId = 'ev-1') {
  const props = { route: { params: { eventId } } } as unknown as Parameters<
    typeof EventDetailScreen
  >[0];

  return render(<EventDetailScreen {...props} />);
}

describe('EventDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEventDetailScreen.mockReturnValue(baseResult);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.dismissedAction });
  });

  it('zeigt den Ladezustand', () => {
    mockUseEventDetailScreen.mockReturnValue({ ...baseResult, isLoading: true });

    renderScreen();

    expect(screen.getByText('Event wird geladen')).toBeTruthy();
  });

  it('zeigt den Fehlerzustand', () => {
    mockUseEventDetailScreen.mockReturnValue({
      ...baseResult,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Fehler beim Laden', technicalMessage: 'x' },
    });

    renderScreen();

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });

  it('zeigt einen Empty State, wenn das Event nicht gefunden wurde', () => {
    mockUseEventDetailScreen.mockReturnValue({ ...baseResult, notFound: true, event: null });

    renderScreen();

    expect(screen.getByText('Dieses Event wurde nicht gefunden.')).toBeTruthy();
  });

  it('zeigt Titel, Beschreibung, Location und Künstler', () => {
    renderScreen();

    expect(screen.getByText('Opening Party')).toBeTruthy();
    expect(screen.getByText('Die beste Opening Party der Saison.')).toBeTruthy();
    expect(screen.getAllByText('Test Club').length).toBeGreaterThan(0);
    expect(screen.getByText('DJ Test')).toBeTruthy();
  });

  it('navigiert beim Tippen auf Zurück', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Zurück'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('ruft Share.share beim Tippen auf Teilen auf', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Teilen'));

    expect(Share.share).toHaveBeenCalledWith({ message: 'Opening Party' });
  });

  it('ruft toggleFavorite beim Tippen auf den Favoriten-Button auf', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Zu Favoriten hinzufügen'));

    expect(baseResult.favorite.toggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('öffnet die Route über Linking mit den Location-Koordinaten', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Route öffnen'));

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://www.google.com/maps/dir/?api=1&destination=39.5,2.6',
    );
  });

  it('navigiert beim Tippen auf die Location zum Location-Detail-Screen', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Test Club'));

    expect(mockNavigate).toHaveBeenCalledWith('LocationDetail', { locationId: 'loc-1' });
  });

  it('navigiert beim Tippen auf einen Künstler zum Artist-Detail-Platzhalter', () => {
    renderScreen();

    fireEvent.press(screen.getByText('DJ Test'));

    expect(mockNavigate).toHaveBeenCalledWith('ArtistDetail', { artistId: 'artist-1' });
  });
});
