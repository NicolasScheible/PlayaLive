import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { OccupancyBadge } from '../../../components/OccupancyBadge';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import type { AppError } from '../../../lib/errors';
import { theme } from '../../../theme/theme';
import type { LocationLiveStatus } from '../../../types/entities';
import { formatRelativeTime } from '../../../utils/formatDateTime';

// Live-Auslastung gemäß Auftrag Punkt 4: „aktuelle Auslastung, Statusbadge, letzte Aktualisierung,
// Realtime-Aktualisierung ohne kompletten Reload" — die Realtime-Anbindung selbst lebt im Hook
// (`useLocationLiveStatus`), diese Komponente ist rein präsentational. Kein radialer
// Fortschrittsring/Prozentwert (docs/DesignSystem.md Kapitel 19 „offene Designentscheidung"): das
// Datenmodell liefert ausschließlich die drei Stufen low/medium/high, kein numerischer Prozentwert —
// ein erfundener Näherungswert würde eine nicht existierende Genauigkeit vortäuschen.
type LocationLiveOccupancySectionProps = {
  liveStatus: LocationLiveStatus | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function LocationLiveOccupancySection({
  liveStatus,
  isLoading,
  isError,
  error,
}: LocationLiveOccupancySectionProps) {
  return (
    <>
      <SectionHeader title="Live-Auslastung" />
      {isLoading ? (
        <View style={styles.padded}>
          <SkeletonBlock width={200} height={32} />
        </View>
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Live-Auslastung konnte nicht geladen werden.'} />
      ) : !liveStatus ? (
        <EmptyState message="Noch keine Meldungen für diese Location." />
      ) : (
        <View style={[styles.padded, styles.content]}>
          <OccupancyBadge
            level={liveStatus.occupancy_level}
            isConfident={liveStatus.is_confident ?? false}
          />
          {liveStatus.wait_time_minutes !== null ? (
            <Text style={styles.meta}>≈ {liveStatus.wait_time_minutes} Min. Wartezeit</Text>
          ) : null}
          {liveStatus.last_reported_at ? (
            <Text style={styles.meta}>
              Letzte Aktualisierung: {formatRelativeTime(liveStatus.last_reported_at)}
            </Text>
          ) : null}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: theme.spacing.md,
  },
  content: {
    gap: 4,
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
