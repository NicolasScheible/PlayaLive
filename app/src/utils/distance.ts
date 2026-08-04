// Client-seitige Entfernungsberechnung, exakt dieselbe äquirektangulare Näherung wie die SQL-Funktion
// `distance_meters()` (supabase/migrations/20260804122716_helper_functions.sql) und dieselbe
// 111320-Konstante wie `LocationService.getLocationsNearby()` — eine Formel, konsistent an beiden
// bereits bestehenden Stellen verwendet statt einer neu erfundenen.
export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const latMeters = (lat2 - lat1) * 111320;
  const lngMeters = (lng2 - lng1) * 111320 * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));

  return Math.sqrt(latMeters ** 2 + lngMeters ** 2);
}
