import { Image, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '../../../components/IconButton';
import { OccupancyBadge } from '../../../components/OccupancyBadge';
import { theme } from '../../../theme/theme';
import type { LocationCategory, OccupancyLevel } from '../../../types/entities';

// Header gemäß Auftrag Punkt 2: „Hero-Bild, Gradient Overlay, Back Button, Favorite Button, Share
// Button, aktueller Auslastungsstatus, Distanz, Kategorie". „Gradient Overlay" als deckender Scrim
// statt eines echten Verlaufs umgesetzt — dieselbe, bereits in `CardImage.tsx` offengelegte
// Vereinfachung („ohne `expo-linear-gradient` ... keine neue Abhängigkeit ohne Auftrag"), hier
// konsistent weitergeführt statt neu entschieden. Zurück-/Teilen-/Favoriten-Buttons über das generische
// `IconButton` (docs/DesignSystem.md Kapitel 11: rundes Icon-Button-Muster für Detail-Screen-Header).
const HERO_HEIGHT = 320;

const CATEGORY_LABELS: Record<LocationCategory, string> = {
  club: 'Club',
  bar: 'Bar',
};

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

type LocationDetailHeaderProps = {
  imageUrl: string | null;
  locationName: string;
  category: LocationCategory;
  occupancyLevel: OccupancyLevel | null;
  isOccupancyConfident: boolean;
  distanceMeters: number | null;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onPressBack: () => void;
  onPressShare: () => void;
};

export function LocationDetailHeader({
  imageUrl,
  locationName,
  category,
  occupancyLevel,
  isOccupancyConfident,
  distanceMeters,
  isFavorited,
  onToggleFavorite,
  onPressBack,
  onPressShare,
}: LocationDetailHeaderProps) {
  return (
    <View style={styles.container} accessibilityLabel={locationName}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderLabel}>{locationName.charAt(0).toUpperCase()}</Text>
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
        <OccupancyBadge level={occupancyLevel} isConfident={isOccupancyConfident} />
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{CATEGORY_LABELS[category]}</Text>
          {distanceMeters !== null ? (
            <Text style={styles.metaText}> · {formatDistance(distanceMeters)}</Text>
          ) : null}
        </View>
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
  metaRow: {
    flexDirection: 'row',
  },
  metaText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
