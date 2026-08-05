import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useFlagReview } from './useFlagReview';

const mockFlagReview = jest.fn();

jest.mock('../../../services/ReviewService', () => ({
  ReviewService: { flagReview: (...args: unknown[]) => mockFlagReview(...args) },
}));

describe('useFlagReview', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft ReviewService.flagReview mit Review-ID und Grund auf und meldet den onSuccess-Callback', async () => {
    mockFlagReview.mockResolvedValue(undefined);
    const onSuccess = jest.fn();

    const { result } = renderHook(() => useFlagReview(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.flagReview({ reviewId: 'rev-1', reason: 'Beleidigend' }, { onSuccess });
    });

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));

    expect(mockFlagReview).toHaveBeenCalledWith({ reviewId: 'rev-1', reason: 'Beleidigend' });
  });

  it('meldet einen Fehler', async () => {
    mockFlagReview.mockRejectedValue({
      code: 'ALREADY_EXISTS',
      messageKey: 'x',
      message: 'Dieser Eintrag existiert bereits.',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useFlagReview(), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.flagReview({ reviewId: 'rev-1', reason: 'Beleidigend' });
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.code).toBe('ALREADY_EXISTS');
  });
});
