import { fireEvent, render, screen } from '@testing-library/react-native';

import { FavoritesScreen } from './FavoritesScreen';

const mockNavigate = jest.fn();
const mockUseFavoritesScreen = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../hooks/useFavoritesScreen', () => ({
  useFavoritesScreen: () => mockUseFavoritesScreen(),
}));

const emptySection = { items: [] as unknown[], isLoading: false, isError: false, error: null };

const location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club' as const,
  address: null,
  latitude: null,
  longitude: null,
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

const baseResult = {
  activeTab: 'location' as const,
  setActiveTab: jest.fn(),
  locations: { ...emptySection, remove: jest.fn() },
  events: { ...emptySection, remove: jest.fn() },
  artists: { ...emptySection, remove: jest.fn() },
};

describe('FavoritesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFavoritesScreen.mockReturnValue(baseResult);
  });

  it('zeigt die Tabs und die Liste des aktiven Tabs', () => {
    mockUseFavoritesScreen.mockReturnValue({
      ...baseResult,
      locations: { ...baseResult.locations, items: [location] },
    });

    render(<FavoritesScreen />);

    expect(screen.getByText('Locations')).toBeTruthy();
    expect(screen.getByText('Test Club')).toBeTruthy();
  });

  it('wechselt beim Tippen auf einen Tab über setActiveTab', () => {
    render(<FavoritesScreen />);

    fireEvent.press(screen.getByText('Events'));

    expect(baseResult.setActiveTab).toHaveBeenCalledWith('event');
  });

  it('navigiert beim Tippen auf eine favorisierte Location zum Location-Detail-Screen', () => {
    mockUseFavoritesScreen.mockReturnValue({
      ...baseResult,
      locations: { ...baseResult.locations, items: [location] },
    });

    render(<FavoritesScreen />);

    fireEvent.press(screen.getByText('Test Club'));

    expect(mockNavigate).toHaveBeenCalledWith('LocationDetail', { locationId: 'loc-1' });
  });

  it('entfernt eine favorisierte Location über den Favoriten-Button', () => {
    const removeLocation = jest.fn();
    mockUseFavoritesScreen.mockReturnValue({
      ...baseResult,
      locations: { ...baseResult.locations, items: [location], remove: removeLocation },
    });

    render(<FavoritesScreen />);

    fireEvent.press(screen.getByLabelText('Aus Favoriten entfernen'));

    expect(removeLocation).toHaveBeenCalledWith('loc-1');
  });

  it('zeigt den Events-Tab-Inhalt, wenn dieser aktiv ist', () => {
    const event = {
      id: 'ev-1',
      location_id: 'loc-1',
      title: 'Closing Party',
      description: null,
      start_time: new Date().toISOString(),
      end_time: null,
      image_url: null,
      is_sponsored: false,
      created_by: null,
      created_at: '',
      updated_at: '',
      deleted_at: null,
      locationName: 'Test Club',
    };
    mockUseFavoritesScreen.mockReturnValue({
      ...baseResult,
      activeTab: 'event',
      events: { ...baseResult.events, items: [event] },
    });

    render(<FavoritesScreen />);

    expect(screen.getByText('Closing Party')).toBeTruthy();

    fireEvent.press(screen.getByText('Closing Party'));

    expect(mockNavigate).toHaveBeenCalledWith('EventDetail', { eventId: 'ev-1' });
  });

  it('zeigt den Artists-Tab-Inhalt, wenn dieser aktiv ist', () => {
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
    mockUseFavoritesScreen.mockReturnValue({
      ...baseResult,
      activeTab: 'artist',
      artists: { ...baseResult.artists, items: [artist] },
    });

    render(<FavoritesScreen />);

    expect(screen.getByText('DJ Test')).toBeTruthy();

    fireEvent.press(screen.getByText('DJ Test'));

    expect(mockNavigate).toHaveBeenCalledWith('ArtistDetail', { artistId: 'artist-1' });
  });

  it('zeigt einen Empty State ohne favorisierte Locations', () => {
    render(<FavoritesScreen />);

    expect(screen.getByText('Du hast noch keine Locations favorisiert.')).toBeTruthy();
  });
});
