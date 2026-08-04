import type { CreateReportInput } from '../../types/dto';
import type { OccupancyLevel } from '../../types/entities';

// Clientseitige Vorabvalidierung für Reports — spiegelt die serverseitigen Constraints aus
// supabase/migrations/20260804122730_reports.sql (dort verbindlich durchgesetzt; hier nur schnelles
// Feedback vor dem Request, siehe docs/Architecture.md Kapitel 17: „Das Frontend entscheidet niemals
// über Berechtigungen").
const OCCUPANCY_LEVELS: readonly OccupancyLevel[] = ['low', 'medium', 'high'];

export function isValidOccupancyLevel(value: string): value is OccupancyLevel {
  return (OCCUPANCY_LEVELS as readonly string[]).includes(value);
}

export function isValidLatitude(latitude: number): boolean {
  return latitude >= -90 && latitude <= 90;
}

export function isValidLongitude(longitude: number): boolean {
  return longitude >= -180 && longitude <= 180;
}

export function isValidWaitTimeMinutes(waitTimeMinutes: number | undefined): boolean {
  return waitTimeMinutes === undefined || waitTimeMinutes >= 0;
}

export function validateCreateReportInput(input: CreateReportInput): string[] {
  const errors: string[] = [];

  if (!isValidOccupancyLevel(input.occupancyLevel)) {
    errors.push('Ungültiges Auslastungslevel.');
  }

  if (!isValidLatitude(input.latitude) || !isValidLongitude(input.longitude)) {
    errors.push('Ungültige Geokoordinaten.');
  }

  if (!isValidWaitTimeMinutes(input.waitTimeMinutes)) {
    errors.push('Die Wartezeit darf nicht negativ sein.');
  }

  return errors;
}
