import { Pressable, StyleSheet, View } from 'react-native';

import { EventCard } from '../../../components/EventCard';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import { theme } from '../../../theme/theme';
import type { EventWithDetails } from '../../../types/entities';

// Aktuelle Auftritte gemäß Auftrag Punkt 5: „Falls laut Datenmodell aktuell ein Event läuft: Anzeige
// spielt gerade, Event, Location. Keine neue Business-Logik entwickeln." Ob aktuell ein Event läuft,
// entscheidet bereits `useArtistEvents`/`useArtistDetailScreen` (identisches Zeitfenster-Prädikat wie
// `EventService.getCurrentEvents()`) — diese Komponente rendert daher nur, wenn der Screen sie mit einem
// vorhandenen Event aufruft. Die bereits bestehende `EventCard` zeigt Location-Namen und (über
// `isLive`) den „spielt gerade"-Hinweis bereits mit — keine doppelte Anzeige nötig. Klick-Handling über
// einen umgebenden `Pressable`, analog zu `LocationTodayEventsSection.tsx`/`EventLocationSection.tsx`.
type ArtistCurrentEventSectionProps = {
  eventDetail: EventWithDetails | null;
  isLoading: boolean;
  onPress: (eventId: string) => void;
};

export function ArtistCurrentEventSection({
  eventDetail,
  isLoading,
  onPress,
}: ArtistCurrentEventSectionProps) {
  return (
    <>
      <SectionHeader title="Aktueller Auftritt" />
      {isLoading || eventDetail === null ? (
        <View style={styles.skeletonRow}>
          <SkeletonBlock width={200} height={120} />
        </View>
      ) : (
        <Pressable onPress={() => onPress(eventDetail.id)} accessibilityRole="button">
          <EventCard
            title={eventDetail.title}
            locationName={eventDetail.location.name}
            startTime={eventDetail.start_time}
            imageUrl={eventDetail.image_url}
            isLive
          />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  skeletonRow: {
    paddingHorizontal: theme.spacing.md,
  },
});
