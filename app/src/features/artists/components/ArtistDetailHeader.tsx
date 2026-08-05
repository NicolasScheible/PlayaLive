import { Image, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '../../../components/IconButton';
import { theme } from '../../../theme/theme';

// Header gemäß Auftrag Punkt 2: „Künstlerbild, Gradient Overlay, Back Button, Share Button, Favoriten
// Button, Künstlername, Genres". „Gradient Overlay" als deckender Scrim statt eines echten Verlaufs —
// dieselbe, bereits in `CardImage.tsx`/`LocationDetailHeader.tsx`/`EventDetailHeader.tsx` offengelegte
// Vereinfachung, hier konsistent weitergeführt. Zurück-/Teilen-/Favoriten-Buttons über das generische
// `IconButton` (docs/DesignSystem.md Kapitel 11: „... in den Headern von Location-/Event-/
// Künstlerprofil-Detailscreens").
const HERO_HEIGHT = 320;

type ArtistDetailHeaderProps = {
  imageUrl: string | null;
  name: string;
  genres: string[];
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onPressBack: () => void;
  onPressShare: () => void;
};

export function ArtistDetailHeader({
  imageUrl,
  name,
  genres,
  isFavorited,
  onToggleFavorite,
  onPressBack,
  onPressShare,
}: ArtistDetailHeaderProps) {
  return (
    <View style={styles.container} accessibilityLabel={name}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderLabel}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.topRow}>
        <IconButton glyph="←" accessibilityLabel="Zurück" onPress={onPressBack} />
        <View style={styles.topRowRight}>
          <IconButton glyph="↗" accessibilityLabel="Teilen" onPress={onPressShare} />
          <IconButton
            glyph={isFavorited ? '♥' : '♡'}
            accessibilityLabel={isFavorited ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
            onPress={onToggleFavorite}
            active={isFavorited}
          />
        </View>
      </View>

      <View style={styles.bottomOverlay}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        {genres.length > 0 ? <Text style={styles.genres}>{genres.join(', ')}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
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
    fontSize: theme.typography.hero.fontSize,
    fontWeight: '700',
  },
  topRow: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRowRight: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  bottomOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay.scrim,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
  genres: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
