import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import type { OccupancyLevel } from '../types/entities';

// Auslastungs-Badge gemäß docs/DesignSystem.md Kapitel 14/19: farbiger Punkt + Textlabel, niemals nur
// Farbe (Accessibility, Kapitel 22). `level: null` bildet den Fall „keine Meldungen vorhanden" ab
// (kein Eintrag in `location_live_status`); `isConfident: false` den in Kapitel 19 als offene
// Designentscheidung markierten vierten Zustand „wenig Meldungen/vorläufige Einschätzung" — hier als
// Präfix „Vorläufig" statt einer eigenen fünften Farbe umgesetzt, um nicht über das entschiedene
// Drei-Status-System hinaus eigene Werte zu erfinden.
type OccupancyBadgeProps = {
  level: OccupancyLevel | null;
  isConfident?: boolean;
};

const LEVEL_LABELS: Record<OccupancyLevel, string> = {
  low: 'Wenig los',
  medium: 'Gut besucht',
  high: 'Sehr voll',
};

export function OccupancyBadge({ level, isConfident = true }: OccupancyBadgeProps) {
  const color = level ? theme.colors.status[level] : theme.colors.text.secondary;
  const baseLabel = level ? LEVEL_LABELS[level] : 'Keine Daten';
  const label = level && !isConfident ? `Vorläufig: ${baseLabel}` : baseLabel;

  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={label}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.overlay.scrim,
    borderRadius: theme.radius.pill,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
  },
});
