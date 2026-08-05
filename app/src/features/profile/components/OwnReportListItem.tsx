import { StyleSheet, Text, View } from 'react-native';

import { OccupancyBadge } from '../../../components/OccupancyBadge';
import { theme } from '../../../theme/theme';
import { formatRelativeTime } from '../../../utils/formatDateTime';
import type { OwnReportWithLocationName } from '../hooks/useOwnReports';

// Listenzeile für einen eigenen Report, analog zu `ReviewListItem.tsx` (Kompakte Listenzeile,
// docs/DesignSystem.md Kapitel 18) — als neue Komponente, da für Reports bislang keine entsprechende
// Anzeige existiert. `OccupancyBadge` bereits bestehend/generisch wiederverwendet. Mood/Musikrichtung
// sind freie Textfelder ohne dokumentierte Werteliste (`reports.mood`/`music_genre`, siehe
// docs/Database.md) — daher unverändert als Rohtext angezeigt, keine erfundene Label-Zuordnung.
type OwnReportListItemProps = {
  report: OwnReportWithLocationName;
};

export function OwnReportListItem({ report }: OwnReportListItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.locationName}>{report.locationName}</Text>
        <Text style={styles.date}>{formatRelativeTime(report.created_at)}</Text>
      </View>
      <OccupancyBadge level={report.occupancy_level} />
      {report.wait_time_minutes !== null ? (
        <Text style={styles.meta}>≈ {report.wait_time_minutes} Min. Wartezeit</Text>
      ) : null}
      {report.mood ? <Text style={styles.meta}>Stimmung: {report.mood}</Text> : null}
      {report.music_genre ? <Text style={styles.meta}>Musik: {report.music_genre}</Text> : null}
      {report.comment ? <Text style={styles.comment}>{report.comment}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
  date: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
  comment: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
  },
});
