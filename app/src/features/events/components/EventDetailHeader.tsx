import { Image, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '../../../components/IconButton';
import { theme } from '../../../theme/theme';
import type { LocationCategory } from '../../../types/entities';
import { formatDateFromTimestamp, formatTime } from '../../../utils/formatDateTime';

// Header gemäß Auftrag Punkt 2: „Eventbild, Gradient Overlay, Back Button, Share Button, Favoriten
// Button, Eventtitel, Datum, Uhrzeit, Kategorie". „Gradient Overlay" als deckender Scrim statt eines
// echten Verlaufs — dieselbe, bereits in `CardImage.tsx`/`LocationDetailHeader.tsx` offengelegte
// Vereinfachung, hier konsistent weitergeführt. `events` hat kein eigenes `category`-Feld
// (docs/Database.md 2.5) — „Kategorie" zeigt daher die Kategorie der zugehörigen Location (Club/Bar),
// keine erfundene neue Spalte. Zurück-/Teilen-/Favoriten-Buttons über das generische `IconButton`
// (docs/DesignSystem.md Kapitel 11).
const HERO_HEIGHT = 320;

const CATEGORY_LABELS: Record<LocationCategory, string> = {
  club: 'Club',
  bar: 'Bar',
};

type EventDetailHeaderProps = {
  imageUrl: string | null;
  title: string;
  startTime: string;
  locationCategory: LocationCategory;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onPressBack: () => void;
  onPressShare: () => void;
};

export function EventDetailHeader({
  imageUrl,
  title,
  startTime,
  locationCategory,
  isFavorited,
  onToggleFavorite,
  onPressBack,
  onPressShare,
}: EventDetailHeaderProps) {
  return (
    <View style={styles.container} accessibilityLabel={title}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderLabel}>{title.charAt(0).toUpperCase()}</Text>
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
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.metaText}>
          {formatDateFromTimestamp(startTime)} · {formatTime(startTime)} ·{' '}
          {CATEGORY_LABELS[locationCategory]}
        </Text>
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
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
  metaText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});
