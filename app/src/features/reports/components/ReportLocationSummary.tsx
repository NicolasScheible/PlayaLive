import { StyleSheet, Text, View } from 'react-native';

import { CardImage } from '../../../components/CardImage';
import { OccupancyBadge } from '../../../components/OccupancyBadge';
import { theme } from '../../../theme/theme';
import type { Location, LocationLiveStatus } from '../../../types/entities';
import { formatRelativeTime } from '../../../utils/formatDateTime';
import { formatDistance } from '../../../utils/formatDistance';

// Anzeige gemäß Auftrag Punkt 1: „ausgewählte Location, aktuelle Live-Auslastung, Zeit der letzten
// Meldung, Entfernung zur Location" — als ein zusammenhängender Kontext-Block oben auf dem Screen.
// Auslastungs-Badge + „letzte Meldung" 1:1 nach dem Muster aus `LocationLiveOccupancySection.tsx`
// (Location Detail), hier erneut dupliziert statt cross-feature importiert (features/README.md).
// `CardImage` ist bereits eine geteilte, nicht feature-gebundene Komponente (`src/components/`) —
// direkt wiederverwendet, keine neue Bild-Darstellung erfunden.
const IMAGE_HEIGHT = 160;

type ReportLocationSummaryProps = {
  location: Location;
  liveStatus: LocationLiveStatus | null;
  isLiveStatusLoading: boolean;
  distanceMeters: number | null;
};

export function ReportLocationSummary({
  location,
  liveStatus,
  isLiveStatusLoading,
  distanceMeters,
}: ReportLocationSummaryProps) {
  return (
    <View style={styles.container}>
      <CardImage
        imageUrl={location.images[0] ?? null}
        fallbackLabel={location.name}
        height={IMAGE_HEIGHT}
      >
        {liveStatus ? (
          <OccupancyBadge
            level={liveStatus.occupancy_level}
            isConfident={liveStatus.is_confident ?? false}
          />
        ) : null}
      </CardImage>

      <Text style={styles.name}>{location.name}</Text>

      <View style={styles.metaRow}>
        {!isLiveStatusLoading && liveStatus?.last_reported_at ? (
          <Text style={styles.meta}>
            Letzte Meldung: {formatRelativeTime(liveStatus.last_reported_at)}
          </Text>
        ) : null}
        {distanceMeters !== null ? (
          <Text style={styles.meta}>{formatDistance(distanceMeters)} entfernt</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
