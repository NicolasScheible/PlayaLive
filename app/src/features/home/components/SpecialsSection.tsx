import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import { SpecialCard } from '../../../components/SpecialCard';
import type { AppError } from '../../../lib/errors';
import type { SpecialWithLocationName } from '../hooks/useSpecials';

// Specials gemäß docs/PRD.md Kapitel 10/7 („Happy Hours & Specials"), Karussell gemäß
// docs/DesignSystem.md Kapitel 6.
type SpecialsSectionProps = {
  specials: SpecialWithLocationName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onRetry?: () => void;
};

export function SpecialsSection({
  specials,
  isLoading,
  isError,
  error,
  onRetry,
}: SpecialsSectionProps) {
  return (
    <>
      <SectionHeader title="Specials" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Specials werden geladen" />
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'Specials konnten nicht geladen werden.'}
          onRetry={onRetry}
        />
      ) : specials.length === 0 ? (
        <EmptyState message="Aktuell sind keine Specials eingetragen." />
      ) : (
        <HorizontalCardList accessibilityLabel="Aktuelle Specials">
          {specials.map((special) => (
            <SpecialCard
              key={special.id}
              locationName={special.locationName}
              title={special.title}
              category={special.category}
              startDate={special.start_date}
              endDate={special.end_date}
              imageUrl={special.image_url}
            />
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}
