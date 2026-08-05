import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useAvatarUpload } from './useAvatarUpload';

const mockRequestMediaLibraryPermissionsAsync = jest.fn();
const mockLaunchImageLibraryAsync = jest.fn();
const mockUploadAvatar = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: (...args: unknown[]) =>
    mockRequestMediaLibraryPermissionsAsync(...args),
  launchImageLibraryAsync: (...args: unknown[]) => mockLaunchImageLibraryAsync(...args),
}));
jest.mock('../../../services/StorageService', () => ({
  StorageService: { uploadAvatar: (...args: unknown[]) => mockUploadAvatar(...args) },
}));
jest.mock('../../../services/AuthService', () => ({
  AuthService: { updateProfile: (...args: unknown[]) => mockUpdateProfile(...args) },
}));

describe('useAvatarUpload', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt das ausgewählte Bild hoch und aktualisiert das Profil', async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///tmp/avatar.jpg', mimeType: 'image/jpeg' }],
    });
    mockUploadAvatar.mockResolvedValue('https://example.test/signed/avatar.jpg');
    mockUpdateProfile.mockResolvedValue({
      id: 'user-1',
      avatar_url: 'https://example.test/signed/avatar.jpg',
    });

    const { result } = renderHook(() => useAvatarUpload(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.pickAndUploadAvatar();
    });

    await waitFor(() => expect(result.current.isUploading).toBe(false));

    expect(mockUploadAvatar).toHaveBeenCalledWith({
      uri: 'file:///tmp/avatar.jpg',
      mimeType: 'image/jpeg',
    });
    expect(mockUpdateProfile).toHaveBeenCalledWith({
      avatarUrl: 'https://example.test/signed/avatar.jpg',
    });
  });

  it('bricht ohne Upload ab, wenn die Berechtigung verweigert wird', async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });

    const { result } = renderHook(() => useAvatarUpload(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.pickAndUploadAvatar();
    });

    await waitFor(() => expect(result.current.isUploading).toBe(false));

    expect(mockLaunchImageLibraryAsync).not.toHaveBeenCalled();
    expect(mockUploadAvatar).not.toHaveBeenCalled();
  });

  it('bricht ohne Upload ab, wenn die Bildauswahl abgebrochen wird', async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: true });
    mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: null });

    const { result } = renderHook(() => useAvatarUpload(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.pickAndUploadAvatar();
    });

    await waitFor(() => expect(result.current.isUploading).toBe(false));

    expect(mockUploadAvatar).not.toHaveBeenCalled();
  });
});
