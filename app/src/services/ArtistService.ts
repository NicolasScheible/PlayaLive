import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { Artist, Event } from '../types/entities';

// Service Layer für Artists (siehe docs/Architecture.md Kapitel 8, docs/API.md Kapitel 5). Ohne
// Repository-Schicht (docs/Architecture.md Kapitel 9).
export const ArtistService = {
  async getArtists(): Promise<Artist[]> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  async getArtistById(id: string): Promise<Artist | null> {
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  // docs/API.md Kapitel 5 „Auftritte (Events) eines Artists abrufen".
  async getArtistEvents(artistId: string): Promise<Event[]> {
    const { data: links, error: linksError } = await supabase
      .from('event_artists')
      .select('event_id')
      .eq('artist_id', artistId);

    if (linksError) {
      throw mapDatabaseError(linksError);
    }

    if (links.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .in(
        'id',
        links.map((link) => link.event_id),
      )
      .is('deleted_at', null)
      .order('start_time', { ascending: true });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },
};
