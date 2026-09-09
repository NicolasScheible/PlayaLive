import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { LocationCard } from '../../../components/LocationCard';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import type { LocationOccupancy } from '../hooks/useLiveOccupancy';

// Live-Auslastung gemäß docs/PRD.md Kapitel 10 (Home: „Live-Auslastung-Übersicht"), Karussell gemäß
// docs/DesignSystem.md Kapitel 6.
type LiveOccupancySectionProps = {
  occupancies: LocationOccupancy[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onRetry?: () => void;
};

export function LiveOccupancySection({
  occupancies,
  isLoading,
  isError,
  error,
  onRetry,
}: LiveOccupancySectionProps) {
  return (
    <>
      <SectionHeader title="Live Auslastung" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Live Auslastung wird geladen" />
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'Live-Auslastung konnte nicht geladen werden.'}
          onRetry={onRetry}
        />
      ) : occupancies.length === 0 ? (
        <EmptyState message="Aktuell keine Locations verfügbar." />
      ) : (
        <HorizontalCardList accessibilityLabel="Live Auslastung der Locations">
          {occupancies.map(({ location, liveStatus }) => (
            <LocationCard
              key={location.id}
              name={location.name}
              imageUrl={location.images[0] ?? null}
              occupancyLevel={liveStatus?.occupancy_level ?? null}
              isOccupancyConfident={liveStatus?.is_confident ?? false}
              waitTimeMinutes={liveStatus?.wait_time_minutes}
            />
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}
