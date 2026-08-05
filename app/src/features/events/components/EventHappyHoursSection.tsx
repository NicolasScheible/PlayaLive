import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { HappyHourCard } from '../../../components/HappyHourCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import type { HappyHour } from '../../../types/entities';
import { WEEKDAY_LABELS } from '../../../utils/weekdayLabels';

// Happy Hours der Event-Location gemäß Auftrag Punkt 6 („falls dem Event zugeordnet und im
// Datenmodell vorhanden") — aufgelöst über die bestehende Location-Beziehung, siehe
// `useEventLocationHappyHours.ts`. Struktur identisch zu `LocationHappyHoursSection.tsx"
// (Location-Detail-Feature), hier als eigenständige Datei statt eines Feature-übergreifenden Imports
// (features/README.md: „nie direkt auf ein anderes Feature-Modul").
type EventHappyHoursSectionProps = {
  locationName: string;
  happyHours: HappyHour[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function EventHappyHoursSection({
  locationName,
  happyHours,
  isLoading,
  isError,
  error,
}: EventHappyHoursSectionProps) {
  return (
    <>
      <SectionHeader title="Happy Hours" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Happy Hours werden geladen" />
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Happy Hours konnten nicht geladen werden.'} />
      ) : happyHours.length === 0 ? (
        <EmptyState message="Aktuell sind keine Happy Hours eingetragen." />
      ) : (
        <HorizontalCardList accessibilityLabel="Happy Hours am Veranstaltungsort">
          {happyHours.map((happyHour) => (
            <HappyHourCard
              key={happyHour.id}
              locationName={locationName}
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
