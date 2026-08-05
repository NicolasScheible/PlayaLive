import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useLocationReviews } from './useLocationReviews';

const mockGetReviews = jest.fn();

jest.mock('../../../services/ReviewService', () => ({
  ReviewService: { getReviews: (...args: unknown[]) => mockGetReviews(...args) },
}));

describe('useLocationReviews', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt Reviews und berechnet Durchschnitt/Anzahl', async () => {
    mockGetReviews.mockResolvedValue([{ rating: 4 }, { rating: 5 }, { rating: 3 }]);

    const { result } = renderHook(() => useLocationReviews('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.reviewCount).toBe(3);
    expect(result.current.averageRating).toBeCloseTo(4);
    expect(mockGetReviews).toHaveBeenCalledWith({ targetType: 'location', targetId: 'loc-1' });
  });

  it('liefert averageRating=null ohne Reviews', async () => {
    mockGetReviews.mockResolvedValue([]);

    const { result } = renderHook(() => useLocationReviews('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.reviewCount).toBe(0);
    expect(result.current.averageRating).toBeNull();
  });
});
