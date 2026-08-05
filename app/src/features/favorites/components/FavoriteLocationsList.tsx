import { Pressable, StyleSheet, View } from 'react-native';

import { IconButton } from '../../../components/IconButton';
import { LocationCard } from '../../../components/LocationCard';
import type { AppError } from '../../../lib/errors';
import type { Location } from '../../../types/entities';

import { FavoriteListSection } from './FavoriteListSection';

// Karten gemäß Auftrag Punkt 3: bestehende `LocationCard` unverändert wiederverwendet. Ohne
// Live-Auslastung (`occupancyLevel={null}`) — deren Anzeige würde für jede favorisierte Location einen
// eigenen `location_live_status`-Request erfordern (kein Batch-Endpunkt vorhanden, vgl.
// `useLiveOccupancy.ts`), was dem Auftrag „Keine unnötigen Requests"/„Keine doppelten Requests"
// widerspräche; `OccupancyBadge` zeigt für `level: null` bereits regulär „Keine Daten" an (kein
// Sonderfall). Entfernen über das etablierte Favoriten-Herz-Muster (`IconButton`, aktiv/♥, siehe
// Detail-Screen-Header) statt eines neuen Icons — der Listeneintrag ist per Definition bereits
// favorisiert.
type FavoriteLocationsListProps = {
  locations: Location[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onPressLocation: (locationId: string) => void;
  onRemove: (locationId: string) => void;
};

export function FavoriteLocationsList({
  locations,
  isLoading,
  isError,
  error,
  onPressLocation,
  onRemove,
}: FavoriteLocationsListProps) {
  return (
    <FavoriteListSection
      items={locations}
      getKey={(location) => location.id}
      isLoading={isLoading}
      isError={isError}
      error={error}
      emptyMessage="Du hast noch keine Locations favorisiert."
      loadingAccessibilityLabel="Favorisierte Locations werden geladen"
      renderItem={(location) => (
        <View style={styles.row}>
          <Pressable onPress={() => onPressLocation(location.id)} accessibilityRole="button">
            <LocationCard
              name={location.name}
              imageUrl={location.images[0] ?? null}
              occupancyLevel={null}
            />
          </Pressable>
          <IconButton
            glyph="♥"
            accessibilityLabel="Aus Favoriten entfernen"
            onPress={() => onRemove(location.id)}
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
