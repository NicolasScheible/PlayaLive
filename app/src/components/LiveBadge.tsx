import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// „LIVE"-Badge gemäß docs/DesignSystem.md Kapitel 14: „kompakte, solide gefüllte Pill in Rot/Pink mit
// weißem Text". Verwendet die Statusfarbe „Sehr voll" als nächstliegenden bereits entschiedenen
// Rot/Pink-Ton (kein eigener dritter Marken-/Statuswert nur für dieses eine Badge, siehe Kapitel 3:
// nicht durchgängig konsistente Zusatzfarben werden bewusst nicht als Token übernommen).
export function LiveBadge() {
  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel="Läuft gerade live">
      <Text style={styles.label}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.status.high,
    borderRadius: theme.radius.pill,
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
