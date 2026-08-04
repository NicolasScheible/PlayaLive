import { renderHook } from '@testing-library/react-native';

import type { AppError } from '../../../lib/errors';
import { useMapStore } from '../../../store/mapStore';

import { useMapScreen } from './useMapScreen';

const userLocationResult = {
  status: 'undetermined' as const,
  coords: null,
  isLoading: false,
  requestPermission: jest.fn(),
};
const mockUseUserLocation = jest.fn(() => userLocationResult);
const mockUseMapLocations = jest.fn(() => ({
  locations: [] as unknown[],
  isLoading: false,
  isError: false,
  error: null as AppError | null,
}));
const mockUseMapFilters = jest.fn((..._args: unknown[]) => ({
  filteredLocations: [] as unknown[],
  isLoading: false,
  isError: false,
  error: null as AppError | null,
}));
const mockUseLocationMarkers = jest.fn((..._args: unknown[]) => ({
  type: 'FeatureCollection' as const,
  features: [] as unknown[],
}));
const mockUseSelectedLocationDetail = jest.fn((..._args: unknown[]) => null);

jest.mock('../../../hooks/useUserLocation', () => ({
  useUserLocation: () => mockUseUserLocation(),
}));
jest.mock('./useMapLocations', () => ({ useMapLocations: () => mockUseMapLocations() }));
jest.mock('./useMapFilters', () => ({
  useMapFilters: (...args: unknown[]) => mockUseMapFilters(...args),
}));
jest.mock('./useLocationMarkers', () => ({
  useLocationMarkers: (...args: unknown[]) => mockUseLocationMarkers(...args),
}));
jest.mock('./useSelectedLocationDetail', () => ({
  useSelectedLocationDetail: (...args: unknown[]) => mockUseSelectedLocationDetail(...args),
}));

describe('useMapScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useMapStore.setState({ selectedLocationId: null });
  });

  it('bündelt Standort, Locations, Filter, Marker und Auswahl', () => {
    const { result } = renderHook(() => useMapScreen());

    expect(result.current.userLocation).toEqual(userLocationResult);
    expect(result.current.filteredLocations).toEqual([]);
    expect(result.current.markers).toEqual({ type: 'FeatureCollection', features: [] });
    expect(result.current.selectedLocationId).toBeNull();
    expect(result.current.selectedLocation).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('selectLocation/clearSelection wirken über den globalen mapStore', () => {
    const { result } = renderHook(() => useMapScreen());

    result.current.selectLocation('loc-1');
    expect(useMapStore.getState().selectedLocationId).toBe('loc-1');

    result.current.clearSelection();
    expect(useMapStore.getState().selectedLocationId).toBeNull();
  });

  it('kombiniert Lade-/Fehlerzustände aus useMapLocations und useMapFilters', () => {
    mockUseMapLocations.mockReturnValue({
      locations: [],
      isLoading: true,
      isError: false,
      error: null,
    });
    mockUseMapFilters.mockReturnValue({
      filteredLocations: [],
      isLoading: false,
      isError: true,
      error: { code: 'ERR', messageKey: 'x', message: 'Fehler', technicalMessage: 'x' },
    });

    const { result } = renderHook(() => useMapScreen());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(true);
    expect(result.current.error?.code).toBe('ERR');
  });
});
