import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { SpecialFilters } from '../types/dto';
import type { Special } from '../types/entities';

// Service Layer für Specials (siehe docs/Architecture.md Kapitel 8 „Abgeleiteter Vorschlag", docs/API.md
// Kapitel 6). Ohne Repository-Schicht (docs/Architecture.md Kapitel 9 — kein nennenswerter
// Business-Logik-Bedarf).
export const SpecialService = {
  // docs/API.md Kapitel 6 „Specials/Happy Hours nach Location filtern".
  async getSpecials(filters: SpecialFilters = {}): Promise<Special[]> {
    let query = supabase.from('specials').select('*').eq('is_active', true);

    if (filters.locationId) {
      query = query.eq('location_id', filters.locationId);
    }

    const { data, error } = await query
      .order('priority', { ascending: false })
      .order('start_date', { ascending: true });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  // docs/PRD.md Kapitel 10 „Highlights heute"/„Specials" (Home Dashboard) — aktuell gültige Specials
  // standortübergreifend, optional nach Location eingrenzbar. `end_date` wird clientseitig gefiltert,
  // da PostgREST-Filter für „Spalte ist NULL ODER Spalte >= Wert" ohne zusätzliche `.or()`-Query-Syntax
  // nicht mit dem übrigen Filterkettenstil dieses Services kombinierbar sind; für die kleine,
  // insgesamt erwartete Special-Anzahl ausreichend.
  async getActiveSpecials(filters: SpecialFilters = {}): Promise<Special[]> {
    const today = new Date().toISOString().slice(0, 10);

    let query = supabase
      .from('specials')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', today);

    if (filters.locationId) {
      query = query.eq('location_id', filters.locationId);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data.filter((special) => special.end_date === null || special.end_date >= today);
  },

  // docs/API.md Kapitel 6 „Aktuell gültige Specials ... einer Location abrufen".
  getActiveSpecialsForLocation(locationId: string): Promise<Special[]> {
    return this.getActiveSpecials({ locationId });
  },
};
