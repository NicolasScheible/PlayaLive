import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { LocationFilters, NearbyLocationFilters } from '../types/dto';
import type { Location, LocationWithLiveStatus } from '../types/entities';

// Service Layer für Locations (siehe docs/Architecture.md Kapitel 8, docs/API.md Kapitel 3). Ohne
// Repository-Schicht (docs/Architecture.md Kapitel 9 — kein nennenswerter Business-Logik-Bedarf).
//
// 🔴 Location-Details enthalten in docs/API.md Kapitel 3 auch „Specials, Happy Hours" — die
// zugehörigen Tabellen (`specials`, `happy_hours`) sind nicht Teil der bisherigen Datenbankschritte,
// daher liefert `getLocationById` diese Felder aktuell nicht mit.
export const LocationService = {
  async getLocations(filters: LocationFilters = {}): Promise<Location[]> {
    let query = supabase.from('locations').select('*').is('deleted_at', null);

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  async getLocationById(id: string): Promise<LocationWithLiveStatus | null> {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      throw mapDatabaseError(error, {
        notFound: { code: 'LOCATION_NOT_FOUND', message: 'Diese Location wurde nicht gefunden.' },
      });
    }

    if (!data) {
      return null;
    }

    const { data: liveStatus, error: liveStatusError } = await supabase
      .from('location_live_status')
      .select('*')
      .eq('location_id', id)
      .maybeSingle();

    if (liveStatusError) {
      throw mapDatabaseError(liveStatusError);
    }

    return { ...data, liveStatus: liveStatus ?? null };
  },

  // docs/API.md Kapitel 3 „Locations nach Nähe/Geokoordinaten abfragen": Bounding-Box-Näherung statt
  // exakter Umkreissuche — die in supabase/migrations/20260804122716_helper_functions.sql definierte
  // `distance_meters()`-Funktion ist als reine SQL-Funktion nicht direkt über einen PostgREST-Filter
  // ansprechbar; eine exakte serverseitige Umkreissuche würde eine eigene RPC-Funktion erfordern
  // (keine neue Migration in diesem Schritt).
  async getLocationsNearby(filters: NearbyLocationFilters): Promise<Location[]> {
    const latDelta = filters.radiusMeters / 111320;
    const lngDelta = filters.radiusMeters / (111320 * Math.cos((filters.latitude * Math.PI) / 180));

    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .is('deleted_at', null)
      .gte('latitude', filters.latitude - latDelta)
      .lte('latitude', filters.latitude + latDelta)
      .gte('longitude', filters.longitude - lngDelta)
      .lte('longitude', filters.longitude + lngDelta);

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },
};
