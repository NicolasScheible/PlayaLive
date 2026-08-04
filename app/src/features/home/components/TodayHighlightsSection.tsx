import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { EventCard } from '../../../components/EventCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import type { EventWithLocationName } from '../hooks/useCurrentActs';

// Highlights heute gemäß docs/PRD.md Kapitel 10 (Home: „Highlights"), siehe useTodayHighlights.ts für
// die Einschränkung auf „heutige Events" statt einer nicht dokumentierten „Top"/„Trend"-Rangfolge.
type TodayHighlightsSectionProps = {
  events: EventWithLocationName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function TodayHighlightsSection({
  events,
  isLoading,
  isError,
  error,
}: TodayHighlightsSectionProps) {
  return (
    <>
      <SectionHeader title="Highlights heute" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Highlights heute werden geladen" />
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Highlights konnten nicht geladen werden.'} />
      ) : events.length === 0 ? (
        <EmptyState message="Heute sind noch keine Highlights eingetragen." />
      ) : (
        <HorizontalCardList accessibilityLabel="Highlights heute">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              locationName={event.locationName}
              startTime={event.start_time}
              imageUrl={event.image_url}
            />
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}
