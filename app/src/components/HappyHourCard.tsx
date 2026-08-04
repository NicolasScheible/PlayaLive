import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import { formatTimeOfDay } from '../utils/formatDateTime';

import { CardImage } from './CardImage';

// docs/DesignSystem.md Kapitel 12 Card-Tabelle „HappyHourCard": Location-Bild/-Logo, Name, Zeitraum,
// Angebot, Wochentags-Auswahl, Favoriten-Herz. Favoriten-Herz bewusst nicht Teil dieser Umsetzung
// (Favoriten-Feature nicht Teil dieses Auftrags). „Wochentags-Auswahl" (Filter-UI) ist eine
// Übersichtsscreen-Funktion, nicht Teil einer einzelnen Card — hier stattdessen der Wochentag der
// konkreten Happy Hour als Text angezeigt.
const CARD_WIDTH = 200;
const IMAGE_HEIGHT = 100;

type HappyHourCardProps = {
  locationName: string;
  weekdayLabel: string;
  startTime: string;
  endTime: string;
  offerText: string | null;
  imageUrl: string | null;
};

export function HappyHourCard({
  locationName,
  weekdayLabel,
  startTime,
  endTime,
  offerText,
  imageUrl,
}: HappyHourCardProps) {
  const timeRange = `${weekdayLabel} · ${formatTimeOfDay(startTime)}–${formatTimeOfDay(endTime)}`;

  return (
    <View style={styles.container} accessible accessibilityLabel={`${locationName}, ${timeRange}`}>
      <CardImage imageUrl={imageUrl} fallbackLabel={locationName} height={IMAGE_HEIGHT} />
      <Text style={styles.location} numberOfLines={1}>
        {locationName}
      </Text>
      <Text style={styles.time}>{timeRange}</Text>
      {offerText ? (
        <Text style={styles.offer} numberOfLines={1}>
          {offerText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    gap: 2,
  },
  location: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  time: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
  offer: {
    color: theme.colors.brand.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '600',
  },
});
