import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useUserLocation } from './useUserLocation';

const mockGetForegroundPermissionsAsync = jest.fn();
const mockRequestForegroundPermissionsAsync = jest.fn();
const mockGetCurrentPositionAsync = jest.fn();
const mockWatchPositionAsync = jest.fn();
const mockRemove = jest.fn();

jest.mock('expo-location', () => ({
  Accuracy: { Balanced: 3 },
  getForegroundPermissionsAsync: (...args: unknown[]) => mockGetForegroundPermissionsAsync(...args),
  requestForegroundPermissionsAsync: (...args: unknown[]) =>
    mockRequestForegroundPermissionsAsync(...args),
  getCurrentPositionAsync: (...args: unknown[]) => mockGetCurrentPositionAsync(...args),
  watchPositionAsync: (...args: unknown[]) => mockWatchPositionAsync(...args),
}));

const coords = { latitude: 39.5079, longitude: 2.6467 };

describe('useUserLocation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fragt beim Mount NICHT automatisch die Berechtigung an, sondern liest nur den Status', async () => {
    mockGetForegroundPermissionsAsync.mockResolvedValue({ status: 'undetermined' });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.status).toBe('undetermined');
    expect(mockRequestForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(mockGetCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('liest die Position erst, wenn die Berechtigung bereits erteilt ist', async () => {
    mockGetForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockGetCurrentPositionAsync.mockResolvedValue({ coords });
    mockWatchPositionAsync.mockResolvedValue({ remove: mockRemove });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => expect(result.current.coords).toEqual(coords));

    expect(mockGetCurrentPositionAsync).toHaveBeenCalled();
    expect(mockWatchPositionAsync).toHaveBeenCalled();
  });

  it('requestPermission fragt aktiv an und aktualisiert den Status', async () => {
    mockGetForegroundPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
    mockRequestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockGetCurrentPositionAsync.mockResolvedValue({ coords });
    mockWatchPositionAsync.mockResolvedValue({ remove: mockRemove });

    const { result } = renderHook(() => useUserLocation());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let returnedStatus: string | undefined;
    await act(async () => {
      returnedStatus = await result.current.requestPermission();
    });

    expect(returnedStatus).toBe('granted');
    expect(result.current.status).toBe('granted');
  });

  it('beendet das Laden auch, wenn getForegroundPermissionsAsync() ablehnt', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockGetForegroundPermissionsAsync.mockRejectedValue(new Error('Standortdienste deaktiviert'));

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe('undetermined');

    consoleErrorSpy.mockRestore();
  });

  it('wirft keinen ungefangenen Fehler, wenn getCurrentPositionAsync() ablehnt', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockGetForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockGetCurrentPositionAsync.mockRejectedValue(new Error('Kein GPS-Fix'));
    mockWatchPositionAsync.mockResolvedValue({ remove: mockRemove });

    renderHook(() => useUserLocation());

    await waitFor(() => expect(consoleErrorSpy).toHaveBeenCalled());

    consoleErrorSpy.mockRestore();
  });

  it('beendet das watchPositionAsync-Abonnement beim Unmount', async () => {
    mockGetForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockGetCurrentPositionAsync.mockResolvedValue({ coords });
    mockWatchPositionAsync.mockResolvedValue({ remove: mockRemove });

    const { result, unmount } = renderHook(() => useUserLocation());
    await waitFor(() => expect(result.current.coords).toEqual(coords));

    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });
});
