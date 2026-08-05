import { Pressable } from 'react-native';

import { LocationCard } from '../../../components/LocationCard';
import { SectionHeader } from '../../../components/SectionHeader';
import type { Location, LocationLiveStatus } from '../../../types/entities';

// Location gemäß Auftrag Punkt 4 („Zeige die zugehörige Location. Beim Klick Navigation zum
// bestehenden Location Detail Screen") und Punkt 8 („Live Status: aktuelle Auslastung, OccupancyBadge,
// falls verfügbar — vorhandene Services wiederverwenden"). Beides in einer Sektion zusammengeführt,
// da die bereits bestehende, generische `LocationCard` das Auslastungs-Badge selbst mitbringt — keine
// zweite, redundante Live-Status-Anzeige nötig. Klick-Handling über einen umgebenden `Pressable`
// statt einer Änderung an `LocationCard` (CLAUDE.md: „kein Refactoring funktionierenden Codes").
type EventLocationSectionProps = {
  location: Location;
  liveStatus: LocationLiveStatus | null;
  onPress: () => void;
};

export function EventLocationSection({ location, liveStatus, onPress }: EventLocationSectionProps) {
  return (
    <>
      <SectionHeader title="Veranstaltungsort" />
      <Pressable onPress={onPress} accessibilityRole="button">
        <LocationCard
          name={location.name}
          imageUrl={location.images[0] ?? null}
          occupancyLevel={liveStatus?.occupancy_level ?? null}
          isOccupancyConfident={liveStatus?.is_confident ?? false}
          waitTimeMinutes={liveStatus?.wait_time_minutes}
        />
      </Pressable>
    </>
  );
}
