import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../../../theme/theme';

// Social-Login-Button für Google (docs/DesignSystem.md Kapitel 11: „Social-Login-Buttons: neutral/
// hell gefüllte Pills mit Provider-Icon + dunklem Text ... bewusst nicht in der Markenfarbe, sondern
// an die jeweilige Plattform-Konvention angelehnt"). Kein Provider-Icon (docs/DesignSystem.md Kapitel
// 10: Icon-Bibliothek weiterhin offene Designentscheidung, keine neue Abhängigkeit nur dafür) — reiner
// Text-Button. Farben ausschließlich aus theme.ts, mit vertauschten Rollen gegenüber dem primären
// `Button`: `text.primary` (Weiß) als helle Füllung, `background.base` (sehr dunkles Blau-Schwarz) als
// dunkler Text darauf — beides bereits bestehende Tokens, keine neue Farbe.
type GoogleSignInButtonProps = {
  onPress: () => void;
  loading?: boolean;
};

export function GoogleSignInButton({ onPress, loading = false }: GoogleSignInButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [styles.button, pressed && !loading && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.background.base} />
      ) : (
        <Text style={styles.label}>Mit Google anmelden</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius.pill,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.text.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    color: theme.colors.background.base,
  },
});
