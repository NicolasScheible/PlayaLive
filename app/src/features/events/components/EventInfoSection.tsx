import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme/theme';
import { formatDateFromTimestamp, formatTime } from '../../../utils/formatDateTime';
import { formatDistance } from '../../../utils/formatDistance';

// Eventinformationen gemäß Auftrag Punkt 3: „Beschreibung, Beginn, Ende, Veranstaltungsort, Distanz,
// Altersbeschränkung (falls vorhanden), Eintritt (falls vorhanden). Nur vorhandene Daten anzeigen.
// Keine neuen Datenfelder erfinden." `events` hat weder ein Altersbeschränkungs- noch ein
// Eintrittspreis-Feld (docs/Database.md 2.5/supabase/migrations/20260804122723_events.sql) — beide
// daher bewusst nicht Teil dieser Komponente, nicht einmal als stets-leerer Platzhalter-Slot.
type EventInfoSectionProps = {
  description: string | null;
  startTime: string;
  endTime: string | null;
  locationName: string;
  distanceMeters: number | null;
};

export function EventInfoSection({
  description,
  startTime,
  endTime,
  locationName,
  distanceMeters,
}: EventInfoSectionProps) {
  return (
    <View style={styles.container}>
      {description ? <Text style={styles.description}>{description}</Text> : null}

      <View style={styles.row}>
        <Text style={styles.label}>Beginn</Text>
        <Text style={styles.value}>
          {formatDateFromTimestamp(startTime)} · {formatTime(startTime)}
        </Text>
      </View>

      {endTime ? (
        <View style={styles.row}>
          <Text style={styles.label}>Ende</Text>
          <Text style={styles.value}>
            {formatDateFromTimestamp(endTime)} · {formatTime(endTime)}
          </Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.label}>Veranstaltungsort</Text>
        <Text style={styles.value}>{locationName}</Text>
      </View>

      {distanceMeters !== null ? (
        <View style={styles.row}>
          <Text style={styles.label}>Distanz</Text>
          <Text style={styles.value}>{formatDistance(distanceMeters)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  description: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  value: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
