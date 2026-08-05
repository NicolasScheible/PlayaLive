import { act, renderHook } from '@testing-library/react-native';

import { useFavoritesScreen } from './useFavoritesScreen';

const mockUseFavoriteLocations = jest.fn((_enabled: boolean) => ({ items: [], isLoading: false }));
const mockUseFavoriteEvents = jest.fn((_enabled: boolean) => ({ items: [], isLoading: false }));
const mockUseFavoriteArtists = jest.fn((_enabled: boolean) => ({ items: [], isLoading: false }));

jest.mock('./useFavoriteLocations', () => ({
  useFavoriteLocations: (enabled: boolean) => mockUseFavoriteLocations(enabled),
}));
jest.mock('./useFavoriteEvents', () => ({
  useFavoriteEvents: (enabled: boolean) => mockUseFavoriteEvents(enabled),
}));
jest.mock('./useFavoriteArtists', () => ({
  useFavoriteArtists: (enabled: boolean) => mockUseFavoriteArtists(enabled),
}));

describe('useFavoritesScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('startet mit dem Locations-Tab aktiv, die anderen beiden deaktiviert', () => {
    renderHook(() => useFavoritesScreen());

    expect(mockUseFavoriteLocations).toHaveBeenCalledWith(true);
    expect(mockUseFavoriteEvents).toHaveBeenCalledWith(false);
    expect(mockUseFavoriteArtists).toHaveBeenCalledWith(false);
  });

  it('aktiviert beim Tab-Wechsel ausschließlich den gewählten Tab', () => {
    const { result, rerender } = renderHook(() => useFavoritesScreen());

    act(() => {
      result.current.setActiveTab('artist');
    });
    rerender({});

    expect(mockUseFavoriteLocations).toHaveBeenLastCalledWith(false);
    expect(mockUseFavoriteEvents).toHaveBeenLastCalledWith(false);
    expect(mockUseFavoriteArtists).toHaveBeenLastCalledWith(true);
  });
});
