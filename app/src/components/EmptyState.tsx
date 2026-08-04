import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Generischer Leerzustand für Sections (docs/Architecture.md Kapitel 15: „Jeder Screen kennt vier klar
// definierte Zustände: Loading, Success, Empty, Error").
type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  message: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
});
