import { renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useWeather } from './useWeather';

const mockGetCurrentWeather = jest.fn();

jest.mock('../../../services/WeatherService', () => ({
  WeatherService: { getCurrentWeather: (...args: unknown[]) => mockGetCurrentWeather(...args) },
}));

describe('useWeather', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('liefert den aktuellen Wetter-Snapshot', async () => {
    const snapshot = {
      temperatureCelsius: 28,
      feelsLikeCelsius: 30,
      condition: 'klarer Himmel',
      conditionIcon: '01d',
      humidityPercent: 55,
      windSpeedKmh: 12,
      fetchedAt: '2026-08-04T12:00:00.000Z',
    };
    mockGetCurrentWeather.mockResolvedValue(snapshot);

    const { result } = renderHook(() => useWeather(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.weather).toEqual(snapshot);
    expect(result.current.isError).toBe(false);
  });

  it('liefert isError, wenn der WeatherService wirft', async () => {
    mockGetCurrentWeather.mockRejectedValue({ code: 'WEATHER_NOT_CONFIGURED', message: 'x' });

    const { result } = renderHook(() => useWeather(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.weather).toBeNull();
    expect(result.current.error?.code).toBe('WEATHER_NOT_CONFIGURED');
  });

  it('lädt die Daten über retry() erneut, ohne den gesamten Dashboard-Cache zu invalidieren', async () => {
    mockGetCurrentWeather.mockResolvedValue({
      temperatureCelsius: 28,
      feelsLikeCelsius: 30,
      condition: 'klarer Himmel',
      conditionIcon: '01d',
      humidityPercent: 55,
      windSpeedKmh: 12,
      fetchedAt: '2026-08-04T12:00:00.000Z',
    });

    const { result } = renderHook(() => useWeather(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockGetCurrentWeather).toHaveBeenCalledTimes(1);

    result.current.retry();

    await waitFor(() => expect(mockGetCurrentWeather).toHaveBeenCalledTimes(2));
  });
});
