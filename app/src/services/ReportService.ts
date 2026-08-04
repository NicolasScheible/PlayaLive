import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { ReportRepository } from '../repositories/ReportRepository';
import type { CreateReportFlagInput, CreateReportInput } from '../types/dto';
import type { LocationLiveStatus, Report } from '../types/entities';

import { AuthService } from './AuthService';
import { validateCreateReportInput } from './validation/reportValidation';

// Service Layer für Reports (siehe docs/Architecture.md Kapitel 8/9, docs/API.md Kapitel 8). Mit
// Repository-Schicht (ReportRepository.ts) gemäß Architekturentscheidung 5 — der Service übernimmt
// Validierung, Business-Logik-Koordination und Fehlerübersetzung, die Repository-Schicht ausschließlich
// den Datenzugriff. Rate-Limiting und Geofencing sind serverseitig als DB-Trigger durchgesetzt
// (supabase/migrations/20260804122730_reports.sql) — die clientseitige Validierung hier ist nur
// schnelles Feedback, keine sicherheitsrelevante Prüfung (docs/Architecture.md Kapitel 17: „Das
// Frontend entscheidet niemals über Berechtigungen").
async function requireUserId(): Promise<string> {
  const { session } = await AuthService.getSession();

  if (!session) {
    const error: AppError = {
      code: 'AUTH_SESSION_MISSING',
      messageKey: 'errors.auth.AUTH_SESSION_MISSING',
      message: 'Du musst angemeldet sein, um diese Aktion auszuführen.',
      technicalMessage: 'No active session',
    };
    throw error;
  }

  return session.user.id;
}

function validationFailed(errors: string[]): AppError {
  return {
    code: 'VALIDATION_ERROR',
    messageKey: 'errors.database.VALIDATION_ERROR',
    message: errors[0],
    technicalMessage: errors.join(' '),
  };
}

export const ReportService = {
  async createReport(input: CreateReportInput): Promise<Report> {
    const validationErrors = validateCreateReportInput(input);

    if (validationErrors.length > 0) {
      throw validationFailed(validationErrors);
    }

    const userId = await requireUserId();

    try {
      return await ReportRepository.insertReport({
        user_id: userId,
        location_id: input.locationId,
        occupancy_level: input.occupancyLevel,
        wait_time_minutes: input.waitTimeMinutes ?? null,
        mood: input.mood ?? null,
        music_genre: input.musicGenre ?? null,
        comment: input.comment ?? null,
        latitude: input.latitude,
        longitude: input.longitude,
      });
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  async getOwnReports(): Promise<Report[]> {
    const userId = await requireUserId();

    try {
      return await ReportRepository.findOwnReports(userId);
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  // docs/API.md Kapitel 8 „Aktuellen, aggregierten Live-Status einer Location abrufen" — liest die
  // serverseitig vorab aggregierte View `location_live_status` (docs/PRD.md Kapitel 15
  // „Community-Report-Aggregation"), keine clientseitige Aggregationslogik.
  async getLiveStatus(locationId: string): Promise<LocationLiveStatus | null> {
    try {
      return await ReportRepository.findLiveStatus(locationId);
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  async flagReport(input: CreateReportFlagInput): Promise<void> {
    const userId = await requireUserId();

    try {
      await ReportRepository.insertReportFlag({
        report_id: input.reportId,
        flagged_by_user_id: userId,
        reason: input.reason,
      });
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },
};
