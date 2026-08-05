import { Pressable, StyleSheet, View } from 'react-native';

import { EventCard } from '../../../components/EventCard';
import { IconButton } from '../../../components/IconButton';
import type { AppError } from '../../../lib/errors';
import type { FavoriteEventWithLocationName } from '../hooks/useFavoriteEvents';

import { FavoriteListSection } from './FavoriteListSection';

// Karten gemäß Auftrag Punkt 3: bestehende `EventCard` unverändert wiederverwendet. Entfernen über das
// etablierte Favoriten-Herz-Muster, analog zu `FavoriteLocationsList`/`FavoriteArtistsList`.
type FavoriteEventsListProps = {
  events: FavoriteEventWithLocationName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onPressEvent: (eventId: string) => void;
  onRemove: (eventId: string) => void;
};

export function FavoriteEventsList({
  events,
  isLoading,
  isError,
  error,
  onPressEvent,
  onRemove,
}: FavoriteEventsListProps) {
  return (
    <FavoriteListSection
      items={events}
      getKey={(event) => event.id}
      isLoading={isLoading}
      isError={isError}
      error={error}
      emptyMessage="Du hast noch keine Events favorisiert."
      loadingAccessibilityLabel="Favorisierte Events werden geladen"
      renderItem={(event) => (
        <View style={styles.row}>
          <Pressable onPress={() => onPressEvent(event.id)} accessibilityRole="button">
            <EventCard
              title={event.title}
              locationName={event.locationName}
              startTime={event.start_time}
              imageUrl={event.image_url}
            />
          </Pressable>
          <IconButton
            glyph="♥"
            accessibilityLabel="Aus Favoriten entfernen"
            onPress={() => onRemove(event.id)}
            active
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
