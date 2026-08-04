import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// App-Header gemäß docs/DesignSystem.md Kapitel 2 „Markenidentität": zweifarbige Wortmarke
// „PlayaLive" („Playa" in Weiß, „Live" in der Markenfarbe), mittig positioniert (Kapitel 16
// „Übersichts-Screens zeigen Logo mittig"). Die geschwungene Script-/Handschrift-Schrift der Wortmarke
// ist als offene Designentscheidung markiert (Kapitel 2) — hier mit der Standard-UI-Schrift umgesetzt.
// Hamburger-Menü/Suche/Benachrichtigung (Kapitel 16 rechts) sind bewusst nicht Teil dieses Headers, da
// die dahinterliegenden Screens (Künstler, Favoriten, Einstellungen, ...) nicht Teil dieses
// Arbeitsschritts sind — kein nicht-funktionaler Button ohne Ziel.
export function Header() {
  return (
    <View style={styles.container} accessibilityRole="header">
      <Text style={styles.wordmark} accessibilityLabel="PlayaLive">
        Playa
        <Text style={styles.wordmarkAccent}>Live</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  wordmark: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.text.primary,
  },
  wordmarkAccent: {
    color: theme.colors.brand.primary,
  },
});
