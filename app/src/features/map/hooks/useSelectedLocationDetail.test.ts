import { renderHook, waitFor } from '@testing-library/react-native';

import type { LocationWithLiveStatus } from '../../../types/entities';

import { createQueryWrapper } from './testUtils';
import { useSelectedLocationDetail } from './useSelectedLocationDetail';

const mockGetActiveHappyHoursForLocation = jest.fn();
const mockGetActiveSpecialsForLocation = jest.fn();
const mockGetCurrentEvents = jest.fn();

jest.mock('../../../services/HappyHourService', () => ({
  HappyHourService: {
    getActiveHappyHoursForLocation: (...args: unknown[]) =>
      mockGetActiveHappyHoursForLocation(...args),
  },
}));

jest.mock('../../../services/SpecialService', () => ({
  SpecialService: {
    getActiveSpecialsForLocation: (...args: unknown[]) => mockGetActiveSpecialsForLocation(...args),
  },
}));

jest.mock('../../../services/EventService', () => ({
  EventService: { getCurrentEvents: (...args: unknown[]) => mockGetCurrentEvents(...args) },
}));

const location: LocationWithLiveStatus = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club',
  address: null,
  latitude: 39.5,
  longitude: 2.6,
  opening_hours: null,
  images: [],
  is_sponsored: false,
  sponsored_until: null,
  owner_user_id: null,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
  liveStatus: null,
};

describe('useSelectedLocationDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetActiveHappyHoursForLocation.mockResolvedValue([]);
    mockGetActiveSpecialsForLocation.mockResolvedValue([]);
    mockGetCurrentEvents.mockResolvedValue([]);
  });

  it('liefert null ohne ausgewählte Location', () => {
    const { result } = renderHook(() => useSelectedLocationDetail(null, [location], null), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current).toBeNull();
    expect(mockGetActiveHappyHoursForLocation).not.toHaveBeenCalled();
  });

  it('lädt Happy Hours, Specials und aktuelle Events der ausgewählten Location', async () => {
    mockGetActiveHappyHoursForLocation.mockResolvedValue([{ id: 'hh-1' }]);
    mockGetActiveSpecialsForLocation.mockResolvedValue([{ id: 'sp-1' }]);
    mockGetCurrentEvents.mockResolvedValue([{ id: 'ev-1' }]);

    const { result } = renderHook(() => useSelectedLocationDetail('loc-1', [location], null), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current?.isLoading).toBe(false));

    expect(result.current?.activeHappyHours).toEqual([{ id: 'hh-1' }]);
    expect(result.current?.activeSpecials).toEqual([{ id: 'sp-1' }]);
    expect(result.current?.currentEvents).toEqual([{ id: 'ev-1' }]);
    expect(mockGetActiveHappyHoursForLocation).toHaveBeenCalledWith('loc-1');
    expect(mockGetCurrentEvents).toHaveBeenCalledWith({ locationId: 'loc-1' });
  });

  it('berechnet die Entfernung zum Nutzerstandort', async () => {
    const { result } = renderHook(
      () => useSelectedLocationDetail('loc-1', [location], { latitude: 39.5, longitude: 2.6 }),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current?.isLoading).toBe(false));

    expect(result.current?.distanceMeters).toBe(0);
  });

  it('liefert distanceMeters=null ohne Nutzerstandort', async () => {
    const { result } = renderHook(() => useSelectedLocationDetail('loc-1', [location], null), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current?.isLoading).toBe(false));

    expect(result.current?.distanceMeters).toBeNull();
  });
});
