import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { HappyHourCard } from '../../../components/HappyHourCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import { WEEKDAY_LABELS } from '../../../utils/weekdayLabels';
import type { HappyHourWithLocationName } from '../hooks/useHappyHours';

// Happy Hours gemäß docs/PRD.md Kapitel 10 (Home: „Happy Hours"), Karussell gemäß
// docs/DesignSystem.md Kapitel 6.

type HappyHoursSectionProps = {
  happyHours: HappyHourWithLocationName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onRetry?: () => void;
};

export function HappyHoursSection({
  happyHours,
  isLoading,
  isError,
  error,
  onRetry,
}: HappyHoursSectionProps) {
  return (
    <>
      <SectionHeader title="Happy Hours" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Happy Hours werden geladen" />
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'Happy Hours konnten nicht geladen werden.'}
          onRetry={onRetry}
        />
      ) : happyHours.length === 0 ? (
        <EmptyState message="Heute sind keine Happy Hours eingetragen." />
      ) : (
        <HorizontalCardList accessibilityLabel="Happy Hours heute">
          {happyHours.map((happyHour) => (
            <HappyHourCard
              key={happyHour.id}
              locationName={happyHour.locationName}
              weekdayLabel={WEEKDAY_LABELS[happyHour.weekday]}
              startTime={happyHour.start_time}
              endTime={happyHour.end_time}
              offerText={happyHour.offer_text}
              imageUrl={null}
            />
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}
