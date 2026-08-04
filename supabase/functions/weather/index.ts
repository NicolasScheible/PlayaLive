// Edge Function „weather" — sicherer Server-Proxy zu OpenWeather (docs/PRD.md Kapitel 15 „Wetter-API":
// „Wetterdaten werden niemals direkt im Frontend abgefragt, sondern über einen eigenen Weather Service
// (Frontend → Weather Service → OpenWeather API)"). Der OpenWeather-API-Key lebt ausschließlich hier als
// Secret (`supabase secrets set OPENWEATHER_API_KEY=...`), niemals im Client-Bundle.
//
// Liefert ausschließlich die für das kompakte Home-Dashboard-Wetter-Widget benötigten Felder
// (Temperatur, gefühlte Temperatur, Wetterzustand, Luftfeuchtigkeit, Windgeschwindigkeit) über
// OpenWeathers „Current Weather Data"-Endpunkt. Regenwahrscheinlichkeit, UV-Index und Sonnenauf-/
// -untergang (docs/PRD.md Kapitel 14) erfordern die kostenpflichtige One-Call-API und sind bewusst nicht
// Teil dieses Schritts — sie gehören zum separaten, hier nicht umgesetzten Wetter-Detailscreen
// (docs/PRD.md Kapitel 10 „Weather").
//
// Feste Koordinaten für Playa de Palma statt Nutzerstandort: docs/API.md Kapitel 11 „Aktuelles Wetter
// ... für Playa de Palma abrufen" — PlayaLive ist auf diesen einen Ort fokussiert (docs/PRD.md Kapitel 6
// „Nicht-Ziele": keine allgemeine Reise-/Mallorca-App).
const PLAYA_DE_PALMA_LATITUDE = 39.5079;
const PLAYA_DE_PALMA_LONGITUDE = 2.6467;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type OpenWeatherResponse = {
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number };
  weather: Array<{ description: string; icon: string }>;
};

type WeatherSnapshotPayload = {
  temperatureCelsius: number;
  feelsLikeCelsius: number;
  condition: string;
  conditionIcon: string;
  humidityPercent: number;
  windSpeedKmh: number;
  fetchedAt: string;
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const apiKey = Deno.env.get('OPENWEATHER_API_KEY');

  if (!apiKey) {
    return jsonResponse({ error: 'WEATHER_NOT_CONFIGURED' }, 503);
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('lat', String(PLAYA_DE_PALMA_LATITUDE));
  url.searchParams.set('lon', String(PLAYA_DE_PALMA_LONGITUDE));
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'de');
  url.searchParams.set('appid', apiKey);

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(url);
  } catch {
    return jsonResponse({ error: 'WEATHER_UPSTREAM_UNREACHABLE' }, 502);
  }

  if (!upstreamResponse.ok) {
    return jsonResponse({ error: 'WEATHER_UPSTREAM_ERROR' }, 502);
  }

  const data = (await upstreamResponse.json()) as OpenWeatherResponse;

  const payload: WeatherSnapshotPayload = {
    temperatureCelsius: Math.round(data.main.temp),
    feelsLikeCelsius: Math.round(data.main.feels_like),
    condition: data.weather[0]?.description ?? '',
    conditionIcon: data.weather[0]?.icon ?? '',
    humidityPercent: data.main.humidity,
    windSpeedKmh: Math.round(data.wind.speed * 3.6),
    fetchedAt: new Date().toISOString(),
  };

  return jsonResponse(payload, 200);
});
