import { act, renderHook, waitFor } from '@testing-library/react-native';

import { usePhotoLibraryPermission } from './usePhotoLibraryPermission';

const mockGetMediaLibraryPermissionsAsync = jest.fn();
const mockRequestMediaLibraryPermissionsAsync = jest.fn();

jest.mock('expo-image-picker', () => ({
  PermissionStatus: { GRANTED: 'granted', DENIED: 'denied', UNDETERMINED: 'undetermined' },
  getMediaLibraryPermissionsAsync: (...args: unknown[]) =>
    mockGetMediaLibraryPermissionsAsync(...args),
  requestMediaLibraryPermissionsAsync: (...args: unknown[]) =>
    mockRequestMediaLibraryPermissionsAsync(...args),
}));

describe('usePhotoLibraryPermission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fragt beim Mount NICHT automatisch die Berechtigung an, sondern liest nur den Status', async () => {
    mockGetMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'undetermined' });

    const { result } = renderHook(() => usePhotoLibraryPermission());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.status).toBe('undetermined');
    expect(mockRequestMediaLibraryPermissionsAsync).not.toHaveBeenCalled();
  });

  it('liest einen bereits erteilten Status', async () => {
    mockGetMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });

    const { result } = renderHook(() => usePhotoLibraryPermission());

    await waitFor(() => expect(result.current.status).toBe('granted'));
  });

  it('beendet das Laden auch, wenn getMediaLibraryPermissionsAsync() ablehnt', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockGetMediaLibraryPermissionsAsync.mockRejectedValue(new Error('Fehler'));

    const { result } = renderHook(() => usePhotoLibraryPermission());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.status).toBe('undetermined');

    consoleErrorSpy.mockRestore();
  });

  it('requestPermission fragt aktiv an und aktualisiert den Status', async () => {
    mockGetMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const { result } = renderHook(() => usePhotoLibraryPermission());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let returnedStatus: string | undefined;
    await act(async () => {
      returnedStatus = await result.current.requestPermission();
    });

    expect(returnedStatus).toBe('denied');
    expect(result.current.status).toBe('denied');
  });
});
