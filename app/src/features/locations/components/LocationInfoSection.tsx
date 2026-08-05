import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme/theme';
import type { OpeningHoursSchedule, Weekday } from '../../../types/entities';
import { WEEKDAY_LABELS } from '../../../utils/weekdayLabels';

// Grundinformationen gemäß Auftrag Punkt 3: „Name, Beschreibung, Adresse, Öffnungszeiten, Status
// 'Geöffnet/Geschlossen', Website, Telefonnummer (falls vorhanden)". Website/Telefonnummer laut
// Product-Owner-Entscheidung in diesem Schritt bewusst nicht implementiert (Felder existieren nicht im
// Datenmodell, siehe Abschlussbericht). `isOpen` kommt bereits berechnet vom aufrufenden Hook
// (`useLocationDetailScreen`, nutzt `isOpenNow`) — keine Geschäftslogik in dieser rein visuellen
// Komponente.
const WEEKDAY_DISPLAY_ORDER: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function isValidSchedule(value: unknown): value is OpeningHoursSchedule {
  return typeof value === 'object' && value !== null;
}

type LocationInfoSectionProps = {
  name: string;
  description: string | null;
  address: string | null;
  openingHours: unknown;
  isOpen: boolean;
};

export function LocationInfoSection({
  name,
  description,
  address,
  openingHours,
  isOpen,
}: LocationInfoSectionProps) {
  const schedule = isValidSchedule(openingHours) ? openingHours : null;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View
        style={styles.openStatus}
        accessibilityRole="text"
        accessibilityLabel={isOpen ? 'Geöffnet' : 'Geschlossen'}
      >
        <View style={[styles.openDot, isOpen ? styles.openDotOpen : styles.openDotClosed]} />
        <Text style={styles.openLabel}>{isOpen ? 'Geöffnet' : 'Geschlossen'}</Text>
      </View>

      {description ? <Text style={styles.description}>{description}</Text> : null}
      {address ? <Text style={styles.meta}>{address}</Text> : null}

      {schedule ? (
        <View style={styles.hoursTable}>
          {WEEKDAY_DISPLAY_ORDER.map((weekday) => {
            const daySchedule = schedule[weekday];

            return (
              <View key={weekday} style={styles.hoursRow}>
                <Text style={styles.hoursDay}>{WEEKDAY_LABELS[weekday]}</Text>
                <Text style={styles.hoursValue}>
                  {daySchedule ? `${daySchedule.open}–${daySchedule.close}` : 'Geschlossen'}
                </Text>
              </View>
            );
          })}
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
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
  openStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  openDotOpen: {
    backgroundColor: theme.colors.status.low,
  },
  openDotClosed: {
    backgroundColor: theme.colors.status.high,
  },
  openLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
  description: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  hoursTable: {
    marginTop: theme.spacing.xs,
    gap: 4,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hoursDay: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
  hoursValue: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.caption.fontSize,
  },
});
