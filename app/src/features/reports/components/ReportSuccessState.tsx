import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme/theme';

// Erfolgsdialog gemäß Auftrag Punkt 6 („Success State, automatischer Rücksprung") — als Vollbild-Zustand
// analog zu `EmptyState`/`ErrorState`/`LoadingState` (docs/PRD.md Kapitel 15: „Jeder Screen kennt vier
// klar definierte Zustände: Loading, Success, Empty, Error"), kein neuer Modal-/Dialog-Mechanismus
// (keine Modal-Komponente existiert bislang für einen vergleichbaren Bestätigungs-Flow, siehe
// CLAUDE.md „kein neues Muster einführen"). Der automatische Rücksprung selbst (Timer + Navigation)
// lebt im Screen, nicht hier — diese Komponente bleibt rein präsentational. Grünton
// `theme.colors.status.low` (bereits für „Wenig los"/positive Auslastung entschieden) statt einer neuen
// Erfolgsfarbe.
export function ReportSuccessState() {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.message}>Danke für deine Meldung!</Text>
      <Text style={styles.subMessage}>Die Live-Auslastung wurde aktualisiert.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  icon: {
    color: theme.colors.status.low,
    fontSize: theme.typography.hero.fontSize,
    fontWeight: '700',
  },
  message: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    textAlign: 'center',
  },
  subMessage: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
  },
});
