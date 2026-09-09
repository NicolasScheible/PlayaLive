import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { EventCard } from '../../../components/EventCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import type { EventWithLocationName } from '../hooks/useCurrentActs';

// „Spielt gerade" gemäß docs/PRD.md Kapitel 10 (Home: „„Spielt gerade""), Karussell gemäß
// docs/DesignSystem.md Kapitel 6.
type CurrentActsSectionProps = {
  acts: EventWithLocationName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onRetry?: () => void;
};

export function CurrentActsSection({
  acts,
  isLoading,
  isError,
  error,
  onRetry,
}: CurrentActsSectionProps) {
  return (
    <>
      <SectionHeader title="Spielt gerade" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Aktuelle Acts werden geladen" />
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'Aktuelle Acts konnten nicht geladen werden.'}
          onRetry={onRetry}
        />
      ) : acts.length === 0 ? (
        <EmptyState message="Aktuell läuft nirgends ein Event." />
      ) : (
        <HorizontalCardList accessibilityLabel="Aktuell laufende Acts">
          {acts.map((act) => (
            <EventCard
              key={act.id}
              title={act.title}
              locationName={act.locationName}
              startTime={act.start_time}
              imageUrl={act.image_url}
              isLive
            />
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}
