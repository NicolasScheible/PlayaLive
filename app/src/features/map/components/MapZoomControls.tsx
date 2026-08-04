import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme/theme';

// Zoom-Controls für die Live-Karte im bereits entschiedenen „Icon-Button (rund)"-Stil
// (docs/DesignSystem.md Kapitel 11: „kreisförmig, dunkler halbtransparenter Fond, weißes Icon" — hier
// mit „+"/„−"-Textglyphen statt Icon-Assets, da die konkrete Icon-Bibliothek/-Quelle laut Kapitel 10
// eine offene Designentscheidung ist und keine neue Abhängigkeit eingeführt werden soll). Rein
// präsentational, keine Zoom-Logik/kein Kartenzugriff.
type MapZoomControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
};

export function MapZoomControls({ onZoomIn, onZoomOut }: MapZoomControlsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Näher heranzoomen"
        onPress={onZoomIn}
        style={styles.button}
      >
        <Text style={styles.label}>+</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Weiter herauszoomen"
        onPress={onZoomOut}
        style={styles.button}
      >
        <Text style={styles.label}>−</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.overlay.scrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '600',
  },
});
