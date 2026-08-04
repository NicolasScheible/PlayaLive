import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import type { OccupancyLevel } from '../types/entities';

import { CardImage } from './CardImage';
import { OccupancyBadge } from './OccupancyBadge';

// docs/DesignSystem.md Kapitel 12 Card-Tabelle „LocationCard": Bild, Name, Auslastungs-Badge, Wartezeit,
// Favoriten-Herz, teils Distanz. Favoriten-Herz und Distanz bewusst nicht Teil dieser Umsetzung — beide
// benötigen Funktionalität außerhalb des Home-Dashboard-Auftrags (Favoriten-Feature bzw.
// Standortberechtigung/Kartenintegration).
const CARD_WIDTH = 200;
const IMAGE_HEIGHT = 140;

type LocationCardProps = {
  name: string;
  imageUrl: string | null;
  occupancyLevel: OccupancyLevel | null;
  isOccupancyConfident?: boolean;
  waitTimeMinutes?: number | null;
};

export function LocationCard({
  name,
  imageUrl,
  occupancyLevel,
  isOccupancyConfident = true,
  waitTimeMinutes,
}: LocationCardProps) {
  return (
    <View style={styles.container} accessible accessibilityLabel={name}>
      <CardImage imageUrl={imageUrl} fallbackLabel={name} height={IMAGE_HEIGHT}>
        <OccupancyBadge level={occupancyLevel} isConfident={isOccupancyConfident} />
      </CardImage>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      {waitTimeMinutes !== undefined && waitTimeMinutes !== null ? (
        <Text style={styles.meta}>≈ {waitTimeMinutes} Min. Wartezeit</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    gap: 4,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
