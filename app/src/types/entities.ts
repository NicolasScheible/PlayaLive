import type { Database } from './database';

// Domänentypen — direkte Aliase der Datenbank-Row-Typen (siehe database.ts), Feldnamen bewusst wie in
// docs/Database.md/docs/PRD.md Kapitel 16 dokumentiert (snake_case), keine eigenen Synonyme
// (CLAUDE.md → Namenskonventionen: „Fachbegriffe konsistent aus der Domäne übernehmen").
export type UserRole = Database['public']['Enums']['user_role'];
export type TrustLevel = Database['public']['Enums']['trust_level'];
export type LocationCategory = Database['public']['Enums']['location_category'];
export type FavoriteTargetType = Database['public']['Enums']['favorite_target_type'];
export type OccupancyLevel = Database['public']['Enums']['occupancy_level'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Location = Database['public']['Tables']['locations']['Row'];
export type Artist = Database['public']['Tables']['artists']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];
export type EventArtist = Database['public']['Tables']['event_artists']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
export type ReportFlag = Database['public']['Tables']['report_flags']['Row'];
export type LocationLiveStatus = Database['public']['Views']['location_live_status']['Row'];

// Zusammengesetzte Lesetypen für Detailansichten (docs/API.md Kapitel 3/4: „Location-Details ...
// inkl. aktuellem Auslastungslevel", „Event-Details ... inkl. zugeordneter Location und Artists").
export type LocationWithLiveStatus = Location & {
  liveStatus: LocationLiveStatus | null;
};

export type EventWithDetails = Event & {
  location: Location;
  artists: Artist[];
};
