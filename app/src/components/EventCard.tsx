import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import { formatTime } from '../utils/formatDateTime';

import { CardImage } from './CardImage';
import { LiveBadge } from './LiveBadge';

// docs/DesignSystem.md Kapitel 12 Card-Tabelle „EventCard": Uhrzeit, Künstlerbild, Name, „Live on
// Stage"-Label, Location, Auslastungs-Badge, Distanz, Favoriten-Herz. Künstlerbild/-name, Distanz und
// Favoriten-Herz sind bewusst nicht Teil dieser Umsetzung — Künstlerdaten sind laut Auftrag nicht Teil
// dieses Schritts (kein Event↔Artist-Lookup je Card, um N+1-Anfragen auf dem Home Dashboard zu
// vermeiden), Distanz benötigt Standortberechtigung/Karte, Favoriten-Herz das Favoriten-Feature.
const CARD_WIDTH = 200;
const IMAGE_HEIGHT = 120;

type EventCardProps = {
  title: string;
  locationName: string;
  startTime: string;
  imageUrl: string | null;
  isLive?: boolean;
};

export function EventCard({
  title,
  locationName,
  startTime,
  imageUrl,
  isLive = false,
}: EventCardProps) {
  return (
    <View style={styles.container} accessible accessibilityLabel={`${title}, ${locationName}`}>
      <CardImage imageUrl={imageUrl} fallbackLabel={title} height={IMAGE_HEIGHT}>
        {isLive ? <LiveBadge /> : null}
      </CardImage>
      <Text style={styles.time}>{formatTime(startTime)}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.location} numberOfLines={1}>
        {locationName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    gap: 2,
  },
  time: {
    color: theme.colors.brand.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '700',
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
});
