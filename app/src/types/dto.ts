import type { FavoriteTargetType, LocationCategory, OccupancyLevel } from './entities';

// DTOs (Data Transfer Objects) — Eingabeformen für den Service Layer, camelCase nach TS-Konvention für
// Funktionsparameter (CLAUDE.md → Namenskonventionen: „Variablen/Funktionen: camelCase"). Enthalten nur
// Felder, die der aufrufende Code liefert; server-verwaltete Felder (id, user_id, created_at, ...)
// gehören nicht dazu.

export type CreateReportInput = {
  locationId: string;
  occupancyLevel: OccupancyLevel;
  waitTimeMinutes?: number;
  mood?: string;
  musicGenre?: string;
  comment?: string;
  latitude: number;
  longitude: number;
};

export type CreateReportFlagInput = {
  reportId: string;
  reason: string;
};

export type CreateFavoriteInput = {
  targetType: FavoriteTargetType;
  targetId: string;
};

export type UpdateProfileInput = {
  displayName?: string;
  avatarUrl?: string;
};

export type LocationFilters = {
  category?: LocationCategory;
};

// docs/API.md Kapitel 3: „Locations nach Nähe/Geokoordinaten abfragen" — radiusMeters wird im
// LocationService als Bounding-Box-Vorfilter verwendet (Näherung, siehe LocationService.ts).
export type NearbyLocationFilters = {
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export type EventFilters = {
  locationId?: string;
  from?: string;
  to?: string;
};
