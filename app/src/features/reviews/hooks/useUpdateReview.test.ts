import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useUpdateReview } from './useUpdateReview';

const mockUpdateReview = jest.fn();

jest.mock('../../../services/ReviewService', () => ({
  ReviewService: { updateReview: (...args: unknown[]) => mockUpdateReview(...args) },
}));

describe('useUpdateReview', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft ReviewService.updateReview mit Review-ID und Eingabe auf und meldet Erfolg', async () => {
    mockUpdateReview.mockResolvedValue({ id: 'rev-1' });

    const { result } = renderHook(() => useUpdateReview(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.updateReview('rev-1', 'location', 'loc-1', {
        rating: 4,
        commentText: 'Aktualisiert',
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockUpdateReview).toHaveBeenCalledWith('rev-1', {
      rating: 4,
      commentText: 'Aktualisiert',
    });
  });

  it('meldet einen Fehler, z. B. wenn die Review nicht gehört', async () => {
    mockUpdateReview.mockRejectedValue({
      code: 'REVIEW_NOT_FOUND',
      messageKey: 'x',
      message: 'Diese Bewertung wurde nicht gefunden oder gehört dir nicht.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useUpdateReview(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.updateReview('rev-1', 'location', 'loc-1', { rating: 4 });
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.code).toBe('REVIEW_NOT_FOUND');
  });
});
