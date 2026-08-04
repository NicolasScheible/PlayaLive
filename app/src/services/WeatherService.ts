import type { AppError } from '../lib/errors';
import { supabase } from '../lib/supabase';

// Service Layer für Wetter (siehe docs/Architecture.md Kapitel 8, docs/API.md Kapitel 11). Ruft
// ausschließlich die Edge Function `weather` (supabase/functions/weather/index.ts) auf — niemals
// direkt die OpenWeather-API (docs/PRD.md Kapitel 15 „Wetter-API"). Kein Repository (docs/Architecture.md
// Kapitel 9 — reiner Lesezugriff ohne Business-Logik im Client).
//
// Kein eigener Eintrag in src/types/entities.ts/dto.ts: `WeatherSnapshot` bildet keine Datenbanktabelle
// ab (Wetterdaten werden nicht persistiert), daher hier direkt neben dem Service definiert.
export type WeatherSnapshot = {
  temperatureCelsius: number;
  feelsLikeCelsius: number;
  condition: string;
  conditionIcon: string;
  humidityPercent: number;
  windSpeedKmh: number;
  fetchedAt: string;
};

const WEATHER_ERROR_MESSAGES = {
  WEATHER_NOT_CONFIGURED: 'Die Wetteranzeige ist aktuell nicht verfügbar.',
  WEATHER_UPSTREAM_UNREACHABLE: 'Die Wetteranzeige ist aktuell nicht verfügbar.',
  WEATHER_UPSTREAM_ERROR: 'Die Wetteranzeige ist aktuell nicht verfügbar.',
  NETWORK_OFFLINE: 'Bitte überprüfe deine Internetverbindung.',
  UNKNOWN_ERROR: 'Das Wetter konnte nicht geladen werden.',
} as const;

type WeatherErrorCode = keyof typeof WEATHER_ERROR_MESSAGES;

function isWeatherErrorCode(value: string): value is WeatherErrorCode {
  return value in WEATHER_ERROR_MESSAGES;
}

// Die Edge Function liefert Fehler als JSON-Body `{ error: 'WEATHER_NOT_CONFIGURED' | ... }` mit
// einem Non-2xx-Status. supabase-js reicht diesen Body bei `functions.invoke` nicht automatisch
// geparst durch, sondern nur über `error.context` (die rohe Response) — daher hier explizit gelesen.
async function extractFunctionErrorCode(error: unknown): Promise<string | undefined> {
  if (typeof error !== 'object' || error === null || !('context' in error)) {
    return undefined;
  }

  const context = (error as { context: unknown }).context;

  if (
    typeof context !== 'object' ||
    context === null ||
    typeof (context as { json?: unknown }).json !== 'function'
  ) {
    return undefined;
  }

  try {
    const body: unknown = await (context as { json: () => Promise<unknown> }).json();

    if (
      typeof body === 'object' &&
      body !== null &&
      typeof (body as { error?: unknown }).error === 'string'
    ) {
      return (body as { error: string }).error;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

async function mapWeatherError(error: unknown): Promise<AppError> {
  const functionErrorCode = await extractFunctionErrorCode(error);

  const code: WeatherErrorCode = (() => {
    if (functionErrorCode && isWeatherErrorCode(functionErrorCode)) {
      return functionErrorCode;
    }

    return error instanceof TypeError ? 'NETWORK_OFFLINE' : 'UNKNOWN_ERROR';
  })();

  return {
    code,
    messageKey: `errors.weather.${code}`,
    message: WEATHER_ERROR_MESSAGES[code],
    technicalMessage: error instanceof Error ? error.message : String(error),
  };
}

export const WeatherService = {
  // docs/API.md Kapitel 11 „Aktuelles Wetter ... für Playa de Palma abrufen" — feste Koordinate
  // serverseitig in der Edge Function hinterlegt, kein Standort-Parameter vom Client nötig.
  async getCurrentWeather(): Promise<WeatherSnapshot> {
    const { data, error } = await supabase.functions.invoke<WeatherSnapshot>('weather');

    if (error) {
      throw await mapWeatherError(error);
    }

    if (!data) {
      throw await mapWeatherError(new Error('Leere Antwort der weather-Edge-Function.'));
    }

    return data;
  },
};
