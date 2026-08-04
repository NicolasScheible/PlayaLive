import { WeatherService } from './WeatherService';

const mockInvoke = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { functions: { invoke: (...args: unknown[]) => mockInvoke(...args) } },
}));

describe('WeatherService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('ruft ausschließlich die weather-Edge-Function auf und gibt die Daten zurück', async () => {
      const snapshot = {
        temperatureCelsius: 28,
        feelsLikeCelsius: 30,
        condition: 'klarer Himmel',
        conditionIcon: '01d',
        humidityPercent: 55,
        windSpeedKmh: 12,
        fetchedAt: '2026-08-04T12:00:00.000Z',
      };
      mockInvoke.mockResolvedValue({ data: snapshot, error: null });

      const result = await WeatherService.getCurrentWeather();

      expect(mockInvoke).toHaveBeenCalledWith('weather');
      expect(result).toEqual(snapshot);
    });

    it('übersetzt WEATHER_NOT_CONFIGURED aus dem Function-Fehlerbody', async () => {
      mockInvoke.mockResolvedValue({
        data: null,
        error: { context: { json: () => Promise.resolve({ error: 'WEATHER_NOT_CONFIGURED' }) } },
      });

      await expect(WeatherService.getCurrentWeather()).rejects.toMatchObject({
        code: 'WEATHER_NOT_CONFIGURED',
      });
    });

    it('fällt auf UNKNOWN_ERROR zurück, wenn kein Fehlerbody gelesen werden kann', async () => {
      mockInvoke.mockResolvedValue({ data: null, error: new Error('boom') });

      await expect(WeatherService.getCurrentWeather()).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
      });
    });

    it('wirft UNKNOWN_ERROR bei leerer Antwort ohne Fehler', async () => {
      mockInvoke.mockResolvedValue({ data: null, error: null });

      await expect(WeatherService.getCurrentWeather()).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
      });
    });
  });
});
