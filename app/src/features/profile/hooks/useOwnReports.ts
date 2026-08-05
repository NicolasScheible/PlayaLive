import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { LocationService } from '../../../services/LocationService';
import { ReportService } from '../../../services/ReportService';
import type { Location, Report } from '../../../types/entities';

export type OwnReportWithLocationName = Report & { locationName: string };

// Eigene Community Reports gemäß Auftrag Punkt 5 — vollständig über den bereits bestehenden
// `ReportService.getOwnReports()` (docs/API.md Kapitel 8 „Eigene abgegebene Reports abrufen"), keine
// neue Business-Logik. Location-Name analog zu `useOwnReviews.ts`/`useFavoriteEvents.ts` per Lookup-Map
// ergänzt, gleicher Query-Key `['locations','list',{}]` — Cache-Wiederverwendung.
export function useOwnReports() {
  const reportsQuery = useQuery<Report[], AppError>({
    queryKey: ['reports', 'own'],
    queryFn: () => ReportService.getOwnReports(),
  });

  const locationsQuery = useQuery<Location[], AppError>({
    queryKey: ['locations', 'list', {}],
    queryFn: () => LocationService.getLocations(),
  });

  const locationNameById = new Map(
    (locationsQuery.data ?? []).map((location) => [location.id, location.name]),
  );

  const reports: OwnReportWithLocationName[] = (reportsQuery.data ?? []).map((report) => ({
    ...report,
    locationName: locationNameById.get(report.location_id) ?? 'Unbekannte Location',
  }));

  return {
    reports,
    isLoading: reportsQuery.isLoading || locationsQuery.isLoading,
    isError: reportsQuery.isError || locationsQuery.isError,
    error: reportsQuery.error ?? locationsQuery.error ?? null,
  };
}
