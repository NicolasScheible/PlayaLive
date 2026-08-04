import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Generischer, vollflächiger Ladezustand (docs/Architecture.md Kapitel 15: „Jeder Screen kennt vier
// klar definierte Zustände: Loading, Success, Empty, Error") — für Screens ohne bereits sichtbaren
// Inhalt (z. B. Live-Karte vor dem ersten Location-/Berechtigungs-Abruf), im Unterschied zu
// `SkeletonBlock`/`SkeletonRow` für Inhalte, deren Layout schon vor dem Laden bekannt ist.
type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator color={theme.colors.brand.primary} size="large" />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.base,
    gap: theme.spacing.md,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
});
