import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProfileScreen } from './ProfileScreen';

const mockNavigate = jest.fn();
const mockUseProfileScreen = jest.fn();
const mockLogout = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../hooks/useProfileScreen', () => ({
  useProfileScreen: () => mockUseProfileScreen(),
}));

jest.mock('../../auth/hooks/useAuth', () => ({
  useAuth: () => ({ logout: mockLogout, loading: false }),
}));

const profile = {
  id: 'user-1',
  email: 'dj@example.com',
  display_name: 'DJ Test',
  avatar_url: null,
  role: 'user' as const,
  trust_score: 42,
  trust_level: 'trusted' as const,
  reports_count: 5,
  confirmed_reports: 4,
  rejected_reports: 1,
  created_at: '2026-01-15T00:00:00.000Z',
  updated_at: '',
};

const emptySection = { isLoading: false, isError: false, error: null };

const baseResult = {
  profile,
  isLoading: false,
  isError: false,
  error: null,
  stats: {
    favorites: { count: 3, ...emptySection },
    reviews: { reviews: [], ...emptySection },
    reports: { reports: [], ...emptySection },
  },
  updateProfile: { updateProfile: jest.fn(), isSaving: false, error: null },
  avatarUpload: { pickAndUploadAvatar: jest.fn(), isUploading: false, error: null },
};

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfileScreen.mockReturnValue(baseResult);
  });

  it('zeigt den Ladezustand', () => {
    mockUseProfileScreen.mockReturnValue({ ...baseResult, isLoading: true });

    render(<ProfileScreen />);

    expect(screen.getByText('Profil wird geladen')).toBeTruthy();
  });

  it('bietet auch während des Ladens einen Logout-Ausgang (kein Dead-End bei hängendem Request)', () => {
    mockUseProfileScreen.mockReturnValue({ ...baseResult, isLoading: true });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText('Abmelden'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('zeigt den Fehlerzustand', () => {
    mockUseProfileScreen.mockReturnValue({
      ...baseResult,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Fehler beim Laden', technicalMessage: 'x' },
    });

    render(<ProfileScreen />);

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });

  it('bietet auch im Fehlerzustand einen Ausgang über „Abmelden" (kein Dead-End ohne Logout-Möglichkeit)', () => {
    mockUseProfileScreen.mockReturnValue({
      ...baseResult,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Fehler beim Laden', technicalMessage: 'x' },
    });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText('Abmelden'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('bietet auch bei fehlendem Profil (auth.users ohne zugehörige profiles-Zeile) einen Logout-Ausgang', () => {
    mockUseProfileScreen.mockReturnValue({ ...baseResult, profile: null });

    render(<ProfileScreen />);

    expect(screen.getByText('Dieses Profil wurde nicht gefunden.')).toBeTruthy();

    fireEvent.press(screen.getByText('Abmelden'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('zeigt Benutzername, Statistiken und Formular', () => {
    render(<ProfileScreen />);

    expect(screen.getAllByText('DJ Test').length).toBeGreaterThan(0);
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('ruft updateProfile mit dem neuen Benutzernamen auf', () => {
    render(<ProfileScreen />);

    fireEvent.changeText(screen.getByDisplayValue('DJ Test'), 'Neuer Name');
    fireEvent.press(screen.getByText('Speichern'));

    expect(baseResult.updateProfile.updateProfile).toHaveBeenCalledWith({
      displayName: 'Neuer Name',
    });
  });

  it('ruft pickAndUploadAvatar beim Tippen auf das Profilbild auf', () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByLabelText('Profilbild ändern'));

    expect(baseResult.avatarUpload.pickAndUploadAvatar).toHaveBeenCalledTimes(1);
  });

  it('navigiert bei einer Location-Review zur Bearbeitung im ReviewForm-Screen', () => {
    mockUseProfileScreen.mockReturnValue({
      ...baseResult,
      stats: {
        ...baseResult.stats,
        reviews: {
          ...emptySection,
          reviews: [
            {
              id: 'review-1',
              user_id: 'user-1',
              target_type: 'location',
              target_id: 'loc-1',
              rating: 5,
              comment_text: null,
              created_at: new Date().toISOString(),
              updated_at: '',
              deleted_at: null,
              targetName: 'Test Club',
            },
          ],
        },
      },
    });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText('Test Club'));

    expect(mockNavigate).toHaveBeenCalledWith('ReviewForm', {
      targetType: 'location',
      targetId: 'loc-1',
      review: { id: 'review-1', rating: 5, commentText: null },
    });
  });

  it('navigiert bei einer Artist-Review zur Bearbeitung im ReviewForm-Screen', () => {
    mockUseProfileScreen.mockReturnValue({
      ...baseResult,
      stats: {
        ...baseResult.stats,
        reviews: {
          ...emptySection,
          reviews: [
            {
              id: 'review-2',
              user_id: 'user-1',
              target_type: 'artist',
              target_id: 'artist-1',
              rating: 4,
              comment_text: null,
              created_at: new Date().toISOString(),
              updated_at: '',
              deleted_at: null,
              targetName: 'DJ Test Artist',
            },
          ],
        },
      },
    });

    render(<ProfileScreen />);

    fireEvent.press(screen.getByText('DJ Test Artist'));

    expect(mockNavigate).toHaveBeenCalledWith('ReviewForm', {
      targetType: 'artist',
      targetId: 'artist-1',
      review: { id: 'review-2', rating: 4, commentText: null },
    });
  });

  it('ruft logout über den bestehenden useAuth-Hook beim Tippen auf Abmelden auf', () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByText('Abmelden'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
