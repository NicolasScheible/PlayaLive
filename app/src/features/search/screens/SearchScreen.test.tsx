import { fireEvent, render, screen } from '@testing-library/react-native';

import { SearchScreen } from './SearchScreen';

const mockNavigate = jest.fn();
const mockUseGlobalSearch = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../hooks/useGlobalSearch', () => ({
  useGlobalSearch: () => mockUseGlobalSearch(),
}));

const baseResult = {
  query: '',
  setQuery: jest.fn(),
  isQueryPresent: false,
  locations: [],
  events: [],
  artists: [],
  isLoading: false,
  isError: false,
  error: null,
  isEmpty: false,
};

describe('SearchScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGlobalSearch.mockReturnValue(baseResult);
  });

  it('zeigt ohne Suchtext einen Hinweis statt Ladezustand/Ergebnissen', () => {
    render(<SearchScreen />);

    expect(screen.getByText('Suche nach Locations, Events oder Künstlern.')).toBeTruthy();
  });

  it('ruft setQuery bei Eingabe im Suchfeld auf', () => {
    render(<SearchScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('Locations, Events, Künstler durchsuchen'),
      'Sunset',
    );

    expect(baseResult.setQuery).toHaveBeenCalledWith('Sunset');
  });

  it('zeigt den Ladezustand während der Suche', () => {
    mockUseGlobalSearch.mockReturnValue({ ...baseResult, isQueryPresent: true, isLoading: true });

    render(<SearchScreen />);

    expect(screen.getByText('Suche läuft')).toBeTruthy();
  });

  it('zeigt den Fehlerzustand', () => {
    mockUseGlobalSearch.mockReturnValue({
      ...baseResult,
      isQueryPresent: true,
      isError: true,
      error: {
        code: 'ERR',
        messageKey: 'x',
        message: 'Die Suche ist fehlgeschlagen.',
        technicalMessage: 'x',
      },
    });

    render(<SearchScreen />);

    expect(screen.getByText('Die Suche ist fehlgeschlagen.')).toBeTruthy();
  });

  it('zeigt den Empty State ohne Treffer', () => {
    mockUseGlobalSearch.mockReturnValue({ ...baseResult, isQueryPresent: true, isEmpty: true });

    render(<SearchScreen />);

    expect(screen.getByText('Keine Ergebnisse gefunden.')).toBeTruthy();
  });

  it('zeigt nur Bereiche mit Treffern und navigiert beim Tippen auf eine Location', () => {
    mockUseGlobalSearch.mockReturnValue({
      ...baseResult,
      isQueryPresent: true,
      locations: [
        {
          id: 'loc-1',
          name: 'Beach Club Ballermann',
          category: 'club',
        },
      ],
    });

    render(<SearchScreen />);

    expect(screen.getByText('LOCATIONS')).toBeTruthy();
    expect(screen.queryByText('EVENTS')).toBeNull();
    expect(screen.queryByText('KÜNSTLER')).toBeNull();

    fireEvent.press(screen.getByText('Beach Club Ballermann'));

    expect(mockNavigate).toHaveBeenCalledWith('LocationDetail', { locationId: 'loc-1' });
  });

  it('navigiert beim Tippen auf ein Event', () => {
    mockUseGlobalSearch.mockReturnValue({
      ...baseResult,
      isQueryPresent: true,
      events: [
        {
          id: 'ev-1',
          title: 'Opening Party',
          start_time: '2026-08-05T20:00:00.000Z',
        },
      ],
    });

    render(<SearchScreen />);

    fireEvent.press(screen.getByText('Opening Party'));

    expect(mockNavigate).toHaveBeenCalledWith('EventDetail', { eventId: 'ev-1' });
  });

  it('navigiert beim Tippen auf einen Künstler', () => {
    mockUseGlobalSearch.mockReturnValue({
      ...baseResult,
      isQueryPresent: true,
      artists: [{ id: 'artist-1', name: 'DJ Test', genres: ['House'] }],
    });

    render(<SearchScreen />);

    fireEvent.press(screen.getByText('DJ Test'));

    expect(mockNavigate).toHaveBeenCalledWith('ArtistDetail', { artistId: 'artist-1' });
  });
});
