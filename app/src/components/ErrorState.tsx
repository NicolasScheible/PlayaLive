import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

import { Button } from './Button';

// Generischer Fehlerzustand für Sections/Screens (docs/Architecture.md Kapitel 15 „Fehlerbehandlung":
// „Jeder Screen kennt vier klar definierte Zustände: Loading, Success, Empty, Error", verständliche
// Texte statt technischer Meldungen). `message` kommt bereits übersetzt aus `AppError.message`
// (src/lib/errors.ts) — keine erneute Übersetzung hier.
type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <View style={styles.retryButton}>
          <Button label="Erneut versuchen" variant="secondary" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  message: {
    color: theme.colors.status.high,
    fontSize: theme.typography.body.fontSize,
  },
  retryButton: {
    minWidth: 160,
  },
});
