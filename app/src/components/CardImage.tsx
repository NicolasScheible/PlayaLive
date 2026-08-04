import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Gemeinsamer Bild-Baustein für Location-/Event-/HappyHour-/Special-Cards (docs/DesignSystem.md
// Kapitel 12 „Cards": „dunkles Verlaufs-Overlay am unteren Bildrand" für lesbaren Text über dem Bild).
// Ohne `expo-linear-gradient` (keine neue Abhängigkeit ohne Auftrag, siehe CLAUDE.md →
// Architekturregeln) wird ein einfacher, deckender Scrim statt eines echten Verlaufs verwendet — eine
// bewusste, offengelegte Vereinfachung, keine visuell abschließende Umsetzung von Kapitel 12.
//
// Platzhalter bei fehlendem Bild (Kapitel 21: „Placeholder-/Ladezustand bei fehlendem Bild" ist offene
// Designentscheidung, in den Mockups nicht gezeigt): erster Buchstabe des Namens auf gedämpftem
// Hintergrund, da noch keine echten Bilder existieren (kein Supabase-Projekt deployt).
type CardImageProps = {
  imageUrl: string | null;
  fallbackLabel: string;
  height: number;
  children?: ReactNode;
};

export function CardImage({ imageUrl, fallbackLabel, height, children }: CardImageProps) {
  return (
    <View style={[styles.container, { height }]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderLabel}>{fallbackLabel.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      {children ? <View style={styles.overlay}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.card,
    overflow: 'hidden',
    backgroundColor: theme.colors.border.subtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay.scrim,
    padding: theme.spacing.sm,
    gap: 4,
  },
});
