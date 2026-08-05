import { useUserLocation } from '../../../hooks/useUserLocation';
import { distanceMeters } from '../../../utils/distance';

import { useCreateReport } from './useCreateReport';
import { useReportLocation } from './useReportLocation';
import { useReportLocationLiveStatus } from './useReportLocationLiveStatus';

// Serverseitig durchgesetzter Geofencing-Radius (supabase/migrations/20260804122730_reports.sql:
// `enforce_report_submission_rules()`, „150 Meter"). Hier ausschließlich für die clientseitige
// Vorab-Anzeige/Deaktivierung des Formulars gespiegelt (Auftrag Punkt 3: „Bereits vorhandene Services
// verwenden. Keine neue Geofencing-Logik entwickeln") — die tatsächliche Durchsetzung bleibt
// serverseitig (docs/Architecture.md Kapitel 17: „Das Frontend entscheidet niemals über
// Berechtigungen").
const GEOFENCE_RADIUS_METERS = 150;

// Einziger Hook, den `CommunityReportScreen.tsx` aufruft (analog zu `useLocationDetailScreen`/
// `useArtistDetailScreen`). Distanzberechnung 1:1 nach dem Muster aus `useLocationDetailScreen.ts`/
// `useSelectedLocationDetail.ts` (`distanceMeters`-Utility). Fehlen die Koordinaten der Location
// (unvollständige Stammdaten), wird die Geofencing-Prüfung übersprungen — exakt wie serverseitig in
// `enforce_report_submission_rules()` (kein Nutzer wird durch unvollständige Stammdaten pauschal
// blockiert).
export function useCommunityReportScreen(locationId: string) {
  const locationResult = useReportLocation(locationId);
  const liveStatus = useReportLocationLiveStatus(locationId);
  const userLocation = useUserLocation();
  const report = useCreateReport(locationId);

  const location = locationResult.location;
  const distance =
    userLocation.coords && location && location.latitude !== null && location.longitude !== null
      ? distanceMeters(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          location.latitude,
          location.longitude,
        )
      : null;

  const isWithinGeofence =
    location && location.latitude !== null && location.longitude !== null
      ? distance !== null && distance <= GEOFENCE_RADIUS_METERS
      : true;

  return {
    location,
    distanceMeters: distance,
    isLoading: locationResult.isLoading,
    isError: locationResult.isError,
    error: locationResult.error,
    notFound: locationResult.notFound,
    liveStatus,
    userLocation,
    isWithinGeofence,
    report,
  };
}
