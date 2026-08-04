import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { HappyHourFilters } from '../types/dto';
import type { HappyHour, Weekday } from '../types/entities';

// Service Layer für Happy Hours (siehe docs/Architecture.md Kapitel 8 „Abgeleiteter Vorschlag",
// docs/API.md Kapitel 6). Ohne Repository-Schicht (docs/Architecture.md Kapitel 9).
const WEEKDAYS: readonly Weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

// JS Date.getDay(): 0 = Sonntag ... 6 = Samstag — Mapping auf das `weekday`-Enum aus
// supabase/migrations/20260804122736_happy_hours.sql.
function currentWeekday(): Weekday {
  return WEEKDAYS[new Date().getDay()];
}

export const HappyHourService = {
  // docs/API.md Kapitel 6 „Specials/Happy Hours nach Location filtern".
  async getHappyHours(filters: HappyHourFilters = {}): Promise<HappyHour[]> {
    let query = supabase.from('happy_hours').select('*').eq('is_active', true);

    if (filters.locationId) {
      query = query.eq('location_id', filters.locationId);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  // docs/API.md Kapitel 6 „Aktuell gültige ... Happy Hours einer Location abrufen" — „aktuell gültig"
  // bei wiederkehrenden Angeboten bedeutet „heute" (Wochentag), nicht ein Datum wie bei Specials.
  async getActiveHappyHoursForLocation(locationId: string): Promise<HappyHour[]> {
    const { data, error } = await supabase
      .from('happy_hours')
      .select('*')
      .eq('location_id', locationId)
      .eq('is_active', true)
      .eq('weekday', currentWeekday())
      .order('start_time', { ascending: true });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },
};
