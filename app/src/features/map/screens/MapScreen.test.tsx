import { fireEvent, render, screen } from '@testing-library/react-native';

import type { Location } from '../../../types/entities';

import { MapScreen } from './MapScreen';

const mockNavigate = jest.fn();
const mockUseMapScreen = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../hooks/useMapScreen', () => ({ useMapScreen: () => mockUseMapScreen() }));

const location: Location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club',
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
  userLocation: {
    status: 'undetermined',
    coords: null,
    isLoading: false,
    requestPermission: jest.fn(),
  },
  filteredLocations: [location],
  markers: { type: 'FeatureCollection', features: [] },
  selectedLocationId: null,
  clearSelection: jest.fn(),
  selectLocation: jest.fn(),
  selectedLocation: null,
  isLoading: false,
  isError: false,
  error: null,
};

describe('MapScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMapScreen.mockReturnValue(baseResult);
  });

  it('zeigt den Ladezustand', () => {
    mockUseMapScreen.mockReturnValue({ ...baseResult, isLoading: true });

    render(<MapScreen />);

    expect(screen.getByText('Karte wird geladen')).toBeTruthy();
  });

  it('zeigt den Fehlerzustand', () => {
    mockUseMapScreen.mockReturnValue({
      ...baseResult,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Karte kaputt', technicalMessage: 'x' },
    });

    render(<MapScreen />);

    expect(screen.getByText('Karte kaputt')).toBeTruthy();
  });

  it('zeigt den Standort-Hinweis, solange die Berechtigung ungeklärt ist', () => {
    render(<MapScreen />);

    expect(screen.getByText('Standort aktivieren')).toBeTruthy();
  });

  it('zeigt keinen Standort-Hinweis, wenn die Berechtigung bereits erteilt wurde', () => {
    mockUseMapScreen.mockReturnValue({
      ...baseResult,
      userLocation: { ...baseResult.userLocation, status: 'granted' },
    });

    render(<MapScreen />);

    expect(screen.queryByText('Standort aktivieren')).toBeNull();
  });

  it('zeigt den Empty State, wenn keine Locations zu den Filtern passen', () => {
    mockUseMapScreen.mockReturnValue({ ...baseResult, filteredLocations: [] });

    render(<MapScreen />);

    expect(screen.getByText('Keine Locations für die aktuellen Filter gefunden.')).toBeTruthy();
  });

  it('zeigt das Bottom Sheet mit Details-Navigation zur ausgewählten Location', () => {
    mockUseMapScreen.mockReturnValue({
      ...baseResult,
      selectedLocationId: 'loc-1',
      selectedLocation: {
        location,
        liveStatus: null,
        activeHappyHours: [],
        activeSpecials: [],
        currentEvents: [],
        distanceMeters: null,
      },
    });

    render(<MapScreen />);

    fireEvent.press(screen.getByText('Details'));

    expect(mockNavigate).toHaveBeenCalledWith('LocationDetail', { locationId: 'loc-1' });
  });
});
