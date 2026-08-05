import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useEventDetail } from './useEventDetail';

const mockGetEventById = jest.fn();

jest.mock('../../../services/EventService', () => ({
  EventService: { getEventById: (...args: unknown[]) => mockGetEventById(...args) },
}));

describe('useEventDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert das Event vom EventService', async () => {
    const event = { id: 'ev-1', title: 'Opening Party', location: { id: 'loc-1' }, artists: [] };
    mockGetEventById.mockResolvedValue(event);

    const { result } = renderHook(() => useEventDetail('ev-1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.event).toEqual(event);
    expect(result.current.notFound).toBe(false);
    expect(mockGetEventById).toHaveBeenCalledWith('ev-1');
  });

  it('markiert notFound, wenn kein Event gefunden wurde', async () => {
    mockGetEventById.mockResolvedValue(null);

    const { result } = renderHook(() => useEventDetail('ev-missing'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.event).toBeNull();
    expect(result.current.notFound).toBe(true);
  });

  it('markiert isError bei einem Ladefehler, nicht notFound', async () => {
    mockGetEventById.mockRejectedValue({
      code: 'SERVER_ERROR',
      messageKey: 'errors.database.SERVER_ERROR',
      message: 'Fehler',
      technicalMessage: 'x',
    });

    const { result } = renderHook(() => useEventDetail('ev-1'), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.notFound).toBe(false);
  });
});
