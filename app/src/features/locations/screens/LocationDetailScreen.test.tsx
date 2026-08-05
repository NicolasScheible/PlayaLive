import { fireEvent, render, screen } from '@testing-library/react-native';
import { Alert, Linking, Share } from 'react-native';

import { LocationDetailScreen } from './LocationDetailScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockUseLocationDetailScreen = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('../hooks/useLocationDetailScreen', () => ({
  useLocationDetailScreen: (locationId: string) => mockUseLocationDetailScreen(locationId),
}));

// `navigation`/weitere Stack-Props sind für den Screen selbst irrelevant (er nutzt ausschließlich
// `useNavigation()` und `route.params`) — nur `route.params.locationId` wird für die Tests benötigt.
function renderScreen(locationId = 'loc-1') {
  const props = { route: { params: { locationId } } } as unknown as Parameters<
    typeof LocationDetailScreen
  >[0];

  return render(<LocationDetailScreen {...props} />);
}

const location = {
  id: 'loc-1',
  name: 'Test Club',
  description: 'Der beste Club der Playa.',
  category: 'club' as const,
  address: 'Carrer de la Festa 1',
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

const emptySection = { isLoading: false, isError: false, error: null };

const baseResult = {
  location,
  distanceMeters: 350,
  isLoading: false,
  isError: false,
  error: null,
  notFound: false,
  liveStatus: { liveStatus: null, ...emptySection },
  happyHours: { happyHours: [], ...emptySection },
  specials: { specials: [], ...emptySection },
  todayEvents: { events: [], ...emptySection },
  reviews: { reviews: [], averageRating: null, reviewCount: 0, ownReview: null, ...emptySection },
  deleteReview: { deleteReview: jest.fn(), isDeleting: false, error: null },
  flagReview: { flagReview: jest.fn(), isSubmitting: false, error: null },
  favorite: {
    isFavorited: false,
    toggleFavorite: jest.fn(),
    isLoading: false,
    isToggling: false,
    error: null,
  },
};

const review = {
  id: 'rev-1',
  user_id: 'user-1',
  target_type: 'location' as const,
  target_id: 'loc-1',
  rating: 4,
  comment_text: 'Ganz ok.',
  created_at: new Date().toISOString(),
  updated_at: '',
  deleted_at: null,
};

describe('LocationDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocationDetailScreen.mockReturnValue(baseResult);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never);
    jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.dismissedAction });
  });

  it('zeigt den Ladezustand', () => {
    mockUseLocationDetailScreen.mockReturnValue({ ...baseResult, isLoading: true });

    renderScreen();

    expect(screen.getByText('Location wird geladen')).toBeTruthy();
  });

  it('zeigt den Fehlerzustand', () => {
    mockUseLocationDetailScreen.mockReturnValue({
      ...baseResult,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Fehler beim Laden', technicalMessage: 'x' },
    });

    renderScreen();

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });

  it('zeigt einen Empty State, wenn die Location nicht gefunden wurde', () => {
    mockUseLocationDetailScreen.mockReturnValue({ ...baseResult, notFound: true, location: null });

    renderScreen();

    expect(screen.getByText('Diese Location wurde nicht gefunden.')).toBeTruthy();
  });

  it('zeigt Name, Beschreibung und Adresse der Location', () => {
    renderScreen();

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Der beste Club der Playa.')).toBeTruthy();
    expect(screen.getByText('Carrer de la Festa 1')).toBeTruthy();
  });

  it('navigiert beim Tippen auf Zurück', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Zurück'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('ruft Share.share beim Tippen auf Teilen auf', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Teilen'));

    expect(Share.share).toHaveBeenCalledWith({ message: 'Test Club' });
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

  it('navigiert beim Tippen auf ein heutiges Event zum Event-Detail-Platzhalter', () => {
    mockUseLocationDetailScreen.mockReturnValue({
      ...baseResult,
      todayEvents: {
        events: [
          {
            id: 'ev-1',
            location_id: 'loc-1',
            title: 'Opening Party',
            description: null,
            start_time: new Date().toISOString(),
            end_time: null,
            image_url: null,
            is_sponsored: false,
            created_by: null,
            created_at: '',
            updated_at: '',
            deleted_at: null,
            isLive: true,
          },
        ],
        ...emptySection,
      },
    });

    renderScreen();

    fireEvent.press(screen.getByText('Opening Party'));

    expect(mockNavigate).toHaveBeenCalledWith('EventDetail', { eventId: 'ev-1' });
  });

  it('navigiert beim Tippen auf „Bewertung abgeben" zum ReviewForm-Screen', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Bewertung abgeben'));

    expect(mockNavigate).toHaveBeenCalledWith('ReviewForm', {
      targetType: 'location',
      targetId: 'loc-1',
    });
  });

  it('navigiert beim Tippen auf „Bearbeiten" mit den vorhandenen Werten zum ReviewForm-Screen', () => {
    mockUseLocationDetailScreen.mockReturnValue({
      ...baseResult,
      reviews: {
        reviews: [review],
        averageRating: 4,
        reviewCount: 1,
        ownReview: review,
        ...emptySection,
      },
    });

    renderScreen();

    fireEvent.press(screen.getByText('Bearbeiten'));

    expect(mockNavigate).toHaveBeenCalledWith('ReviewForm', {
      targetType: 'location',
      targetId: 'loc-1',
      review: { id: 'rev-1', rating: 4, commentText: 'Ganz ok.' },
    });
  });

  it('löscht die eigene Bewertung nach Bestätigung im Dialog', () => {
    mockUseLocationDetailScreen.mockReturnValue({
      ...baseResult,
      reviews: {
        reviews: [review],
        averageRating: 4,
        reviewCount: 1,
        ownReview: review,
        ...emptySection,
      },
    });
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      const confirmButton = buttons?.find((button) => button.style === 'destructive');
      confirmButton?.onPress?.();
    });

    renderScreen();

    fireEvent.press(screen.getByText('Löschen'));

    expect(alertSpy).toHaveBeenCalled();
    expect(baseResult.deleteReview.deleteReview).toHaveBeenCalledWith('rev-1');
  });

  it('meldet eine fremde Bewertung über das Bottom Sheet', () => {
    const otherReview = { ...review, id: 'rev-2', user_id: 'user-2' };
    mockUseLocationDetailScreen.mockReturnValue({
      ...baseResult,
      reviews: {
        reviews: [otherReview],
        averageRating: 4,
        reviewCount: 1,
        ownReview: null,
        ...emptySection,
      },
    });

    renderScreen();

    fireEvent.press(screen.getByText('Melden'));
    fireEvent.changeText(
      screen.getByPlaceholderText('Warum meldest du diese Bewertung?'),
      'Beleidigend',
    );

    const submitButtons = screen.getAllByText('Melden');
    fireEvent.press(submitButtons[submitButtons.length - 1]);

    expect(baseResult.flagReview.flagReview).toHaveBeenCalledWith(
      { reviewId: 'rev-2', reason: 'Beleidigend' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });
});
