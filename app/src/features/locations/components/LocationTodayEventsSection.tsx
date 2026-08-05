import { Pressable } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { EventCard } from '../../../components/EventCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import type { EventWithLiveFlag } from '../hooks/useLocationTodayEvents';

// Heutige Events gemäß Auftrag Punkt 6: „Liste aller heutigen Events dieser Location. Nur Vorschau.
// Beim Klick Navigation zum Event Detail (Platzhalter genügt)". Klick-Handling über einen umgebenden
// `Pressable` statt einer Änderung an `EventCard` (bereits bestehende, funktionierende Komponente,
// CLAUDE.md: „kein Refactoring funktionierenden Codes").
type LocationTodayEventsSectionProps = {
  locationName: string;
  events: EventWithLiveFlag[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onPressEvent: (eventId: string) => void;
};

export function LocationTodayEventsSection({
  locationName,
  events,
  isLoading,
  isError,
  error,
  onPressEvent,
}: LocationTodayEventsSectionProps) {
  return (
    <>
      <SectionHeader title="Heutige Events" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Heutige Events werden geladen" />
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Events konnten nicht geladen werden.'} />
      ) : events.length === 0 ? (
        <EmptyState message="Heute finden keine Events statt." />
      ) : (
        <HorizontalCardList accessibilityLabel="Heutige Events dieser Location">
          {events.map((event) => (
            <Pressable key={event.id} onPress={() => onPressEvent(event.id)}>
              <EventCard
                title={event.title}
                locationName={locationName}
                startTime={event.start_time}
                imageUrl={event.image_url}
                isLive={event.isLive}
              />
            </Pressable>
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}
