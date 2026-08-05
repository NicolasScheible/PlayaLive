import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

import { IconButton } from './IconButton';

// Breite von `IconButton` (siehe IconButton.tsx) — als rechter Ausgleichs-Spacer verwendet, damit die
// Wortmarke unabhängig davon, ob `onPressMenu` gesetzt ist, mittig bleibt (Kapitel 16 „Logo mittig").
const MENU_BUTTON_SIZE = 44;

// App-Header gemäß docs/DesignSystem.md Kapitel 2 „Markenidentität": zweifarbige Wortmarke
// „PlayaLive" („Playa" in Weiß, „Live" in der Markenfarbe), mittig positioniert (Kapitel 16
// „Übersichts-Screens zeigen Logo mittig"). Die geschwungene Script-/Handschrift-Schrift der Wortmarke
// ist als offene Designentscheidung markiert (Kapitel 2) — hier mit der Standard-UI-Schrift umgesetzt.
// `onPressMenu` (optional) zeigt links das Hamburger-Icon „☰" — exakt der in docs/DesignSystem.md
// Kapitel 16 dokumentierte Glyph („Icon „☰" oben links") — über den bestehenden generischen
// `IconButton`. Ohne `onPressMenu` unverändert nur die zentrierte Wortmarke (bisheriges Verhalten
// bleibt für Aufrufer ohne den neuen Prop erhalten). Suche/Benachrichtigung (Kapitel 16 rechts) bleiben
// weiterhin bewusst außen vor, da die dahinterliegenden Screens nicht Teil dieses Arbeitsschritts sind.
type HeaderProps = {
  onPressMenu?: () => void;
};

export function Header({ onPressMenu }: HeaderProps = {}) {
  return (
    <View style={styles.container} accessibilityRole="header">
      {onPressMenu ? (
        <IconButton glyph="☰" accessibilityLabel="Menü öffnen" onPress={onPressMenu} />
      ) : (
        <View style={styles.menuSpacer} />
      )}
      <Text style={styles.wordmark} accessibilityLabel="PlayaLive">
        Playa
        <Text style={styles.wordmarkAccent}>Live</Text>
      </Text>
      <View style={styles.menuSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  menuSpacer: {
    width: MENU_BUTTON_SIZE,
  },
  wordmark: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.text.primary,
  },
  wordmarkAccent: {
    color: theme.colors.brand.primary,
  },
});
