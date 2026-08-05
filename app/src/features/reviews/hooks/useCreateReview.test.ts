import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useCreateReview } from './useCreateReview';

const mockCreateReview = jest.fn();

jest.mock('../../../services/ReviewService', () => ({
  ReviewService: { createReview: (...args: unknown[]) => mockCreateReview(...args) },
}));

describe('useCreateReview', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft ReviewService.createReview mit der Eingabe auf und meldet Erfolg', async () => {
    mockCreateReview.mockResolvedValue({ id: 'rev-1' });

    const { result } = renderHook(() => useCreateReview(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.createReview({
        targetType: 'location',
        targetId: 'loc-1',
        rating: 5,
        commentText: 'Top!',
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockCreateReview).toHaveBeenCalledWith({
      targetType: 'location',
      targetId: 'loc-1',
      rating: 5,
      commentText: 'Top!',
    });
  });

  it('meldet einen Fehler', async () => {
    mockCreateReview.mockRejectedValue({
      code: 'VALIDATION_ERROR',
      messageKey: 'x',
      message: 'Die Bewertung muss zwischen 1 und 5 Sternen liegen.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useCreateReview(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.createReview({ targetType: 'location', targetId: 'loc-1', rating: 0 });
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.code).toBe('VALIDATION_ERROR');
  });
});
