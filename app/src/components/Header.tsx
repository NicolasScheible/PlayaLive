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
// bleibt für Aufrufer ohne den neuen Prop erhalten). `onPressSearch` (optional, Suche-Feature) zeigt
// analog rechts das Lupen-Glyph „⌕" — Kapitel 16 „Übersichts-Screens zeigen Logo mittig + Suche/
// Benachrichtigung/Kalender rechts" war bislang bewusst nicht umgesetzt, da der dahinterliegende
// Suchscreen noch nicht existierte; Benachrichtigung/Kalender bleiben weiterhin außen vor (nicht Teil
// dieses Arbeitsschritts). Ohne `onPressSearch` unverändert nur der Ausgleichs-Spacer.
type HeaderProps = {
  onPressMenu?: () => void;
  onPressSearch?: () => void;
};

export function Header({ onPressMenu, onPressSearch }: HeaderProps = {}) {
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
      {onPressSearch ? (
        <IconButton glyph="⌕" accessibilityLabel="Suche öffnen" onPress={onPressSearch} />
      ) : (
        <View style={styles.menuSpacer} />
      )}
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
