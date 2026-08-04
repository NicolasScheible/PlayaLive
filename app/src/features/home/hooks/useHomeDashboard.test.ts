import { act, renderHook } from '@testing-library/react-native';

import { useHomeDashboard } from './useHomeDashboard';

const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
const mockUseGreeting = jest.fn(() => ({ greeting: 'Guten Abend', displayName: 'Lisa' }));
const mockUseWeather = jest.fn(() => ({
  weather: null,
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseLiveOccupancy = jest.fn(() => ({
  occupancies: [],
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseTodayHighlights = jest.fn(() => ({
  events: [],
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseCurrentActs = jest.fn(() => ({
  acts: [],
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseNextAct = jest.fn(() => ({
  nextAct: null,
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseHappyHours = jest.fn(() => ({
  happyHours: [],
  isLoading: false,
  isError: false,
  error: null,
}));
const mockUseSpecials = jest.fn(() => ({
  specials: [],
  isLoading: false,
  isError: false,
  error: null,
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidateQueries }),
}));

jest.mock('./useGreeting', () => ({ useGreeting: () => mockUseGreeting() }));
jest.mock('./useWeather', () => ({ useWeather: () => mockUseWeather() }));
jest.mock('./useLiveOccupancy', () => ({ useLiveOccupancy: () => mockUseLiveOccupancy() }));
jest.mock('./useTodayHighlights', () => ({ useTodayHighlights: () => mockUseTodayHighlights() }));
jest.mock('./useCurrentActs', () => ({ useCurrentActs: () => mockUseCurrentActs() }));
jest.mock('./useNextAct', () => ({ useNextAct: () => mockUseNextAct() }));
jest.mock('./useHappyHours', () => ({ useHappyHours: () => mockUseHappyHours() }));
jest.mock('./useSpecials', () => ({ useSpecials: () => mockUseSpecials() }));

describe('useHomeDashboard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('bündelt alle Section-Hooks', () => {
    const { result } = renderHook(() => useHomeDashboard());

    expect(result.current.greeting).toEqual(mockUseGreeting());
    expect(result.current.weather).toEqual(mockUseWeather());
    expect(result.current.liveOccupancy).toEqual(mockUseLiveOccupancy());
    expect(result.current.todayHighlights).toEqual(mockUseTodayHighlights());
    expect(result.current.currentActs).toEqual(mockUseCurrentActs());
    expect(result.current.nextAct).toEqual(mockUseNextAct());
    expect(result.current.happyHours).toEqual(mockUseHappyHours());
    expect(result.current.specials).toEqual(mockUseSpecials());
    expect(result.current.isRefreshing).toBe(false);
  });

  it('onRefresh invalidiert alle Home-Queries über einen einzigen Präfix-Key', async () => {
    const { result } = renderHook(() => useHomeDashboard());

    await act(async () => {
      await result.current.onRefresh();
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['home'] });
    expect(result.current.isRefreshing).toBe(false);
  });
});
