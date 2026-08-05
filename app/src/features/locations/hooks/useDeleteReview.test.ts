import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useDeleteReview } from './useDeleteReview';

const mockDeleteReview = jest.fn();

jest.mock('../../../services/ReviewService', () => ({
  ReviewService: { deleteReview: (...args: unknown[]) => mockDeleteReview(...args) },
}));

describe('useDeleteReview', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft ReviewService.deleteReview mit der Review-ID auf', async () => {
    mockDeleteReview.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteReview('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.deleteReview('rev-1');
    });

    await waitFor(() => expect(result.current.isDeleting).toBe(false));

    expect(mockDeleteReview).toHaveBeenCalledWith('rev-1');
  });

  it('meldet einen Fehler', async () => {
    mockDeleteReview.mockRejectedValue({
      code: 'REVIEW_NOT_FOUND',
      messageKey: 'x',
      message: 'Diese Bewertung wurde nicht gefunden oder gehört dir nicht.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useDeleteReview('loc-1'), {
      wrapper: createQueryWrapper(),
    });

    act(() => {
      result.current.deleteReview('rev-1');
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.code).toBe('REVIEW_NOT_FOUND');
  });
});
