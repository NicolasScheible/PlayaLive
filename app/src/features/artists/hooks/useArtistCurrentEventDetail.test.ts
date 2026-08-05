import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useArtistCurrentEventDetail } from './useArtistCurrentEventDetail';

const mockGetEventById = jest.fn();

jest.mock('../../../services/EventService', () => ({
  EventService: { getEventById: (...args: unknown[]) => mockGetEventById(...args) },
}));

describe('useArtistCurrentEventDetail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('lädt die Event-Details für das aktuell laufende Event', async () => {
    const eventDetail = {
      id: 'ev-1',
      title: 'Opening Party',
      location: { id: 'loc-1' },
      artists: [],
    };
    mockGetEventById.mockResolvedValue(eventDetail);

    const { result } = renderHook(() => useArtistCurrentEventDetail('ev-1'), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.eventDetail).toEqual(eventDetail);
    expect(mockGetEventById).toHaveBeenCalledWith('ev-1');
  });

  it('fragt nichts ab, solange kein aktuelles Event vorliegt', () => {
    renderHook(() => useArtistCurrentEventDetail(null), { wrapper: createQueryWrapper() });

    expect(mockGetEventById).not.toHaveBeenCalled();
  });
});
