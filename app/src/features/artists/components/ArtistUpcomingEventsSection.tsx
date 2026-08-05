import { Pressable } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { EventCard } from '../../../components/EventCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import type { EventWithLocationName } from '../hooks/useArtistEvents';

// Kommende Events gemäß Auftrag Punkt 4: „Alle zukünftigen Events dieses Artists anzeigen. Beim Klick
// Navigation zum bestehenden Event Detail Screen. Bestehende Services verwenden. Keine doppelte
// Business-Logik." Struktur/Klick-Handling analog zu `LocationTodayEventsSection.tsx` (umgebender
// `Pressable` statt Änderung an `EventCard`, CLAUDE.md: „kein Refactoring funktionierenden Codes").
type ArtistUpcomingEventsSectionProps = {
  events: EventWithLocationName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onPressEvent: (eventId: string) => void;
};

export function ArtistUpcomingEventsSection({
  events,
  isLoading,
  isError,
  error,
  onPressEvent,
}: ArtistUpcomingEventsSectionProps) {
  return (
    <>
      <SectionHeader title="Kommende Events" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Kommende Events werden geladen" />
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Events konnten nicht geladen werden.'} />
      ) : events.length === 0 ? (
        <EmptyState message="Aktuell sind keine kommenden Events geplant." />
      ) : (
        <HorizontalCardList accessibilityLabel="Kommende Events dieses Künstlers">
          {events.map((event) => (
            <Pressable key={event.id} onPress={() => onPressEvent(event.id)}>
              <EventCard
                title={event.title}
                locationName={event.locationName}
                startTime={event.start_time}
                imageUrl={event.image_url}
              />
            </Pressable>
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}
