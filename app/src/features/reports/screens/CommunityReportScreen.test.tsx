import { fireEvent, render, screen } from '@testing-library/react-native';

import { CommunityReportScreen } from './CommunityReportScreen';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockUseCommunityReportScreen = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));

jest.mock('../hooks/useCommunityReportScreen', () => ({
  useCommunityReportScreen: (locationId: string) => mockUseCommunityReportScreen(locationId),
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

const baseResult = {
  location,
  distanceMeters: 80,
  isLoading: false,
  isError: false,
  error: null,
  notFound: false,
  liveStatus: { liveStatus: null, isLoading: false, isError: false, error: null },
  userLocation: {
    status: 'granted' as const,
    coords: { latitude: 39.5001, longitude: 2.6001 },
    isLoading: false,
    requestPermission: jest.fn(),
  },
  isWithinGeofence: true,
  report: {
    createReport: jest.fn(),
    isSubmitting: false,
    isSuccess: false,
    error: null,
    reset: jest.fn(),
  },
};

function renderScreen(locationId = 'loc-1') {
  const props = { route: { params: { locationId } } } as unknown as Parameters<
    typeof CommunityReportScreen
  >[0];

  return render(<CommunityReportScreen {...props} />);
}

describe('CommunityReportScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCommunityReportScreen.mockReturnValue(baseResult);
  });

  it('zeigt den Ladezustand', () => {
    mockUseCommunityReportScreen.mockReturnValue({ ...baseResult, isLoading: true });

    renderScreen();

    expect(screen.getByText('Location wird geladen')).toBeTruthy();
  });

  it('zeigt den Fehlerzustand', () => {
    mockUseCommunityReportScreen.mockReturnValue({
      ...baseResult,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Fehler beim Laden', technicalMessage: 'x' },
    });

    renderScreen();

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });

  it('zeigt einen Empty State, wenn die Location nicht gefunden wurde', () => {
    mockUseCommunityReportScreen.mockReturnValue({ ...baseResult, notFound: true, location: null });

    renderScreen();

    expect(screen.getByText('Diese Location wurde nicht gefunden.')).toBeTruthy();
  });

  it('zeigt Location, Entfernung und das Meldeformular', () => {
    renderScreen();

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Wenig los')).toBeTruthy();
    expect(screen.getByText('Melden')).toBeTruthy();
  });

  it('ruft createReport mit den ausgewählten Daten auf', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Sehr voll'));
    fireEvent.press(screen.getByText('Melden'));

    expect(baseResult.report.createReport).toHaveBeenCalledWith({
      locationId: 'loc-1',
      occupancyLevel: 'high',
      latitude: 39.5001,
      longitude: 2.6001,
    });
  });

  it('zeigt einen Fehler bei der Meldung inline, ohne den restlichen Screen zu ersetzen', () => {
    mockUseCommunityReportScreen.mockReturnValue({
      ...baseResult,
      report: {
        ...baseResult.report,
        error: {
          code: 'REPORT_RATE_LIMITED',
          messageKey: 'x',
          message: 'Du hast diese Location gerade erst gemeldet. Bitte warte kurz.',
          technicalMessage: 'x',
        },
      },
    });

    renderScreen();

    expect(
      screen.getByText('Du hast diese Location gerade erst gemeldet. Bitte warte kurz.'),
    ).toBeTruthy();
    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Melden')).toBeTruthy();
  });

  it('zeigt das Formular nicht außerhalb des Geofencing-Radius', () => {
    mockUseCommunityReportScreen.mockReturnValue({ ...baseResult, isWithinGeofence: false });

    renderScreen();

    expect(screen.queryByText('Wenig los')).toBeNull();
    expect(screen.getByText(/zu weit von dieser Location entfernt/)).toBeTruthy();
  });

  it('zeigt den Erfolgszustand nach erfolgreicher Meldung und springt automatisch zurück', () => {
    jest.useFakeTimers();
    mockUseCommunityReportScreen.mockReturnValue({
      ...baseResult,
      report: { ...baseResult.report, isSuccess: true },
    });

    renderScreen();

    expect(screen.getByText('Danke für deine Meldung!')).toBeTruthy();
    expect(mockGoBack).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2000);

    expect(mockGoBack).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
