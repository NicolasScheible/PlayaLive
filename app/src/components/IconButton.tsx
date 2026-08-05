import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme/theme';

// Rundes Icon-Button gemäß docs/DesignSystem.md Kapitel 11 „Icon-Buttons (rund)": „kreisförmig,
// dunkler halbtransparenter Fond, weißes Icon — z. B. Zurück-Pfeil, Teilen, Favoriten-Herz in den
// Headern von Location-/Event-/Künstlerprofil-Detailscreens" — als generische Komponente umgesetzt,
// da laut DesignSystem in mindestens drei Detail-Screens wiederverwendet. „Glyph" statt Icon-Asset, da
// die konkrete Icon-Bibliothek/-Quelle laut Kapitel 10 eine offene Designentscheidung ist und keine
// neue Abhängigkeit eingeführt werden soll (gleiche Entscheidung wie bei `MapZoomControls`).
// `active` färbt das Glyph in der Markenfarbe (Kapitel 10: „im aktiven/hervorgehobenen Zustand ... in
// der Markenfarbe").
type IconButtonProps = {
  glyph: string;
  accessibilityLabel: string;
  onPress: () => void;
  active?: boolean;
};

export function IconButton({
  glyph,
  accessibilityLabel,
  onPress,
  active = false,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={styles.button}
    >
      <Text style={[styles.glyph, active && styles.glyphActive]}>{glyph}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.overlay.scrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '600',
  },
  glyphActive: {
    color: theme.colors.brand.primary,
  },
});
