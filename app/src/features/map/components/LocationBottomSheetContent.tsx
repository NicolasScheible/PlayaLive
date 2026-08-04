import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { CardImage } from '../../../components/CardImage';
import { EventCard } from '../../../components/EventCard';
import { HappyHourCard } from '../../../components/HappyHourCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { OccupancyBadge } from '../../../components/OccupancyBadge';
import { SectionHeader } from '../../../components/SectionHeader';
import { SpecialCard } from '../../../components/SpecialCard';
import { theme } from '../../../theme/theme';
import type {
  Event,
  HappyHour,
  Location,
  LocationCategory,
  LocationLiveStatus,
  Special,
  Weekday,
} from '../../../types/entities';

// Bottom-Sheet-Inhalt gemäß Auftrag Punkt 5: „Bild, Name, Kategorie, aktuelle Auslastung, Happy Hours,
// Specials, aktuell laufende Events, Entfernung, Button 'Details'". Ausschließlich Präsentation über
// bereits bestehende, generische Cards (`EventCard`/`HappyHourCard`/`SpecialCard`/`OccupancyBadge`) —
// keine eigene Datenlogik, alle Daten kommen bereits aufbereitet vom aufrufenden Hook
// (`useSelectedLocationDetail`).
const CATEGORY_LABELS: Record<LocationCategory, string> = {
  club: 'Club',
  bar: 'Bar',
};

const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag',
};

const IMAGE_HEIGHT = 160;

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}

type LocationBottomSheetContentProps = {
  location: Location;
  liveStatus: LocationLiveStatus | null;
  activeHappyHours: HappyHour[];
  activeSpecials: Special[];
  currentEvents: Event[];
  distanceMeters: number | null;
  onPressDetails: () => void;
};

export function LocationBottomSheetContent({
  location,
  liveStatus,
  activeHappyHours,
  activeSpecials,
  currentEvents,
  distanceMeters,
  onPressDetails,
}: LocationBottomSheetContentProps) {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <CardImage
        imageUrl={location.images[0] ?? null}
        fallbackLabel={location.name}
        height={IMAGE_HEIGHT}
      >
        <OccupancyBadge
          level={liveStatus?.occupancy_level ?? null}
          isConfident={liveStatus?.is_confident ?? false}
        />
      </CardImage>
      <View style={styles.header}>
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.meta}>
          {CATEGORY_LABELS[location.category]}
          {distanceMeters !== null ? ` · ${formatDistance(distanceMeters)}` : ''}
        </Text>
      </View>

      {activeHappyHours.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Happy Hours" />
          <HorizontalCardList accessibilityLabel="Happy Hours">
            {activeHappyHours.map((happyHour) => (
              <HappyHourCard
                key={happyHour.id}
                locationName={location.name}
                weekdayLabel={WEEKDAY_LABELS[happyHour.weekday]}
                startTime={happyHour.start_time}
                endTime={happyHour.end_time}
                offerText={happyHour.offer_text}
                imageUrl={null}
              />
            ))}
          </HorizontalCardList>
        </View>
      ) : null}

      {activeSpecials.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Specials" />
          <HorizontalCardList accessibilityLabel="Specials">
            {activeSpecials.map((special) => (
              <SpecialCard
                key={special.id}
                locationName={location.name}
                title={special.title}
                category={special.category}
                startDate={special.start_date}
                endDate={special.end_date}
                imageUrl={special.image_url}
              />
            ))}
          </HorizontalCardList>
        </View>
      ) : null}

      {currentEvents.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader title="Spielt gerade" />
          <HorizontalCardList accessibilityLabel="Aktuell laufende Events">
            {currentEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                locationName={location.name}
                startTime={event.start_time}
                imageUrl={event.image_url}
                isLive
              />
            ))}
          </HorizontalCardList>
        </View>
      ) : null}

      <View style={styles.detailsButton}>
        <Button label="Details" onPress={onPressDetails} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  header: {
    gap: 4,
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  section: {
    gap: theme.spacing.sm,
  },
  detailsButton: {
    alignSelf: 'stretch',
  },
});
