import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import type { WeatherSnapshot } from '../../../services/WeatherService';
import { WeatherService } from '../../../services/WeatherService';

// Wetter-Widget gemäß docs/PRD.md Kapitel 10 (Home: „Wetter-Anzeige"). `staleTime` verhindert unnötige
// Edge-Function-/OpenWeather-Aufrufe bei jedem Screen-Fokus (docs/PRD.md Kapitel 15 „Wetter-API":
// „Caching reduziert API-Anfragen") — Wetterdaten ändern sich nicht sekündlich.
const WEATHER_STALE_TIME_MS = 10 * 60 * 1000;

export function useWeather() {
  const query = useQuery<WeatherSnapshot, AppError>({
    queryKey: ['home', 'weather'],
    queryFn: () => WeatherService.getCurrentWeather(),
    staleTime: WEATHER_STALE_TIME_MS,
  });

  return {
    weather: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
