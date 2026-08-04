import { StyleSheet, Text } from 'react-native';

import { theme } from '../../../theme/theme';

// Begrüßung gemäß docs/PRD.md Kapitel 10 (Home: „Begrüßung"). Reine Präsentationskomponente — die
// Tageszeit-/Profil-Logik lebt in `useGreeting()` (siehe dortiger Kommentar zum bewusst fehlenden
// Fehlerzustand).
type GreetingHeaderProps = {
  greeting: string;
  displayName: string | null;
};

export function GreetingHeader({ greeting, displayName }: GreetingHeaderProps) {
  const text = displayName ? `${greeting}, ${displayName}!` : `${greeting}!`;

  return (
    <Text style={styles.text} accessibilityRole="header">
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    paddingHorizontal: theme.spacing.md,
  },
});
