import { renderHook } from '@testing-library/react-native';

import { useProfileScreen } from './useProfileScreen';

const mockProfileResult = {
  profile: { id: 'user-1' },
  isLoading: false,
  isError: false,
  error: null,
};
const mockFavoritesCountResult = { count: 2, isLoading: false, isError: false, error: null };
const mockOwnReviewsResult = { reviews: [], isLoading: false, isError: false, error: null };
const mockOwnReportsResult = { reports: [], isLoading: false, isError: false, error: null };
const mockUpdateProfileResult = { updateProfile: jest.fn(), isSaving: false, error: null };
const mockAvatarUploadResult = { pickAndUploadAvatar: jest.fn(), isUploading: false, error: null };

jest.mock('./useProfile', () => ({ useProfile: () => mockProfileResult }));
jest.mock('./useFavoritesCount', () => ({ useFavoritesCount: () => mockFavoritesCountResult }));
jest.mock('./useOwnReviews', () => ({ useOwnReviews: () => mockOwnReviewsResult }));
jest.mock('./useOwnReports', () => ({ useOwnReports: () => mockOwnReportsResult }));
jest.mock('./useUpdateProfile', () => ({ useUpdateProfile: () => mockUpdateProfileResult }));
jest.mock('./useAvatarUpload', () => ({ useAvatarUpload: () => mockAvatarUploadResult }));

describe('useProfileScreen', () => {
  it('bündelt Profil, Statistiken, Bearbeiten und Avatar-Upload', () => {
    const { result } = renderHook(() => useProfileScreen());

    expect(result.current.profile).toEqual({ id: 'user-1' });
    expect(result.current.stats.favorites).toEqual(mockFavoritesCountResult);
    expect(result.current.stats.reviews).toEqual(mockOwnReviewsResult);
    expect(result.current.stats.reports).toEqual(mockOwnReportsResult);
    expect(result.current.updateProfile).toEqual(mockUpdateProfileResult);
    expect(result.current.avatarUpload).toEqual(mockAvatarUploadResult);
  });
});
