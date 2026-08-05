import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useOwnReviews } from './useOwnReviews';

const mockGetOwnReviews = jest.fn();
const mockGetLocations = jest.fn();
const mockGetArtists = jest.fn();

jest.mock('../../../services/ReviewService', () => ({
  ReviewService: { getOwnReviews: (...args: unknown[]) => mockGetOwnReviews(...args) },
}));
jest.mock('../../../services/LocationService', () => ({
  LocationService: { getLocations: (...args: unknown[]) => mockGetLocations(...args) },
}));
jest.mock('../../../services/ArtistService', () => ({
  ArtistService: { getArtists: (...args: unknown[]) => mockGetArtists(...args) },
}));

const locationReview = {
  id: 'review-1',
  user_id: 'user-1',
  target_type: 'location',
  target_id: 'loc-1',
  rating: 5,
  comment_text: 'Toller Club.',
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

const artistReview = {
  id: 'review-2',
  user_id: 'user-1',
  target_type: 'artist',
  target_id: 'artist-1',
  rating: 4,
  comment_text: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

describe('useOwnReviews', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('löst Location- und Artist-Namen für die jeweiligen Reviews auf', async () => {
    mockGetOwnReviews.mockResolvedValue([locationReview, artistReview]);
    mockGetLocations.mockResolvedValue([{ id: 'loc-1', name: 'Test Club' }]);
    mockGetArtists.mockResolvedValue([{ id: 'artist-1', name: 'DJ Test' }]);

    const { result } = renderHook(() => useOwnReviews(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.reviews).toEqual([
      { ...locationReview, targetName: 'Test Club' },
      { ...artistReview, targetName: 'DJ Test' },
    ]);
  });

  it('nutzt einen Platzhalter-Namen, wenn das Ziel nicht gefunden wird', async () => {
    mockGetOwnReviews.mockResolvedValue([locationReview]);
    mockGetLocations.mockResolvedValue([]);
    mockGetArtists.mockResolvedValue([]);

    const { result } = renderHook(() => useOwnReviews(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.reviews[0].targetName).toBe('Unbekannt');
  });
});
