import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { EventFilters } from '../types/dto';
import type { Event, EventWithDetails } from '../types/entities';

// Service Layer für Events (siehe docs/Architecture.md Kapitel 8, docs/API.md Kapitel 4). Ohne
// Repository-Schicht (docs/Architecture.md Kapitel 9).
export const EventService = {
  // docs/API.md Kapitel 4 „Liste kommender Events abrufen (Tagesprogramm, kommende Events)",
  // „Events nach Location filtern", „Events nach Datum/Zeitraum filtern". Ohne `filters.from` werden
  // ausschließlich Events ab jetzt geliefert („kommende Events").
  async getUpcomingEvents(filters: EventFilters = {}): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .is('deleted_at', null)
      .gte('start_time', filters.from ?? new Date().toISOString());

    if (filters.locationId) {
      query = query.eq('location_id', filters.locationId);
    }

    if (filters.to) {
      query = query.lte('start_time', filters.to);
    }

    const { data, error } = await query.order('start_time', { ascending: true });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  // docs/API.md Kapitel 4 „Event-Details abrufen (inkl. zugeordneter Location und Artists)".
  async getEventById(id: string): Promise<EventWithDetails | null> {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (eventError) {
      throw mapDatabaseError(eventError, {
        notFound: { code: 'EVENT_NOT_FOUND', message: 'Dieses Event wurde nicht gefunden.' },
      });
    }

    if (!event) {
      return null;
    }

    const { data: location, error: locationError } = await supabase
      .from('locations')
      .select('*')
      .eq('id', event.location_id)
      .maybeSingle();

    if (locationError) {
      throw mapDatabaseError(locationError);
    }

    if (!location) {
      // Kein Datenbankfehler, sondern eine verletzte Integritätsannahme (Event ohne zugehörige
      // Location) — daher direkt konstruiert statt über mapDatabaseError (dessen `notFound`-Option
      // ausschließlich den generischen PGRST116-„keine Zeile"-Fall domänenspezifisch übersetzt).
      const error: AppError = {
        code: 'LOCATION_NOT_FOUND',
        messageKey: 'errors.database.LOCATION_NOT_FOUND',
        message: 'Die Location dieses Events wurde nicht gefunden.',
        technicalMessage: `Event ${id} references missing location ${event.location_id}`,
      };
      throw error;
    }

    const { data: links, error: linksError } = await supabase
      .from('event_artists')
      .select('artist_id')
      .eq('event_id', id);

    if (linksError) {
      throw mapDatabaseError(linksError);
    }

    let artists: EventWithDetails['artists'] = [];

    if (links.length > 0) {
      const { data: artistRows, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .in(
          'id',
          links.map((link) => link.artist_id),
        );

      if (artistsError) {
        throw mapDatabaseError(artistsError);
      }

      artists = artistRows;
    }

    return { ...event, location, artists };
  },
};
