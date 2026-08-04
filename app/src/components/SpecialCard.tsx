import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import { formatDate } from '../utils/formatDateTime';

import { CardImage } from './CardImage';

// docs/Database.md 2.7 „Specials": Titel, Location, Kategorie, Zeitraum. Kein eigener Card-Typ in
// docs/DesignSystem.md Kapitel 12 dokumentiert (nur Location/Event/Artist/HappyHour) — hier analog zu
// `HappyHourCard` umgesetzt, da Specials optisch/inhaltlich am nächsten an Happy Hours liegen
// (docs/PRD.md Kapitel 16: „Happy Hours & Specials" durchgängig gemeinsam genannt).
const CARD_WIDTH = 200;
const IMAGE_HEIGHT = 100;

type SpecialCardProps = {
  locationName: string;
  title: string;
  category: string | null;
  startDate: string;
  endDate: string | null;
  imageUrl: string | null;
};

export function SpecialCard({
  locationName,
  title,
  category,
  startDate,
  endDate,
  imageUrl,
}: SpecialCardProps) {
  const dateRange = endDate
    ? `${formatDate(startDate)} – ${formatDate(endDate)}`
    : `ab ${formatDate(startDate)}`;

  return (
    <View style={styles.container} accessible accessibilityLabel={`${title}, ${locationName}`}>
      <CardImage imageUrl={imageUrl} fallbackLabel={title} height={IMAGE_HEIGHT} />
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.location} numberOfLines={1}>
        {locationName}
      </Text>
      <Text style={styles.date}>
        {dateRange}
        {category ? ` · ${category}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    gap: 2,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  location: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
  date: {
    color: theme.colors.brand.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
  },
});
