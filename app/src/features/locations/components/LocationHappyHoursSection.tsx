import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { HappyHourCard } from '../../../components/HappyHourCard';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import type { AppError } from '../../../lib/errors';
import type { HappyHour } from '../../../types/entities';
import { WEEKDAY_LABELS } from '../../../utils/weekdayLabels';

// Happy Hours gemäß Auftrag Punkt 5: „Eigene Bereiche für aktive Specials/aktive Happy Hours ... nur
// bereits aktive Einträge anzeigen" — Datenzugriff bereits im Hook (`useLocationHappyHours`) auf
// aktive Einträge eingeschränkt. Struktur identisch zu `HappyHoursSection.tsx` (Home Dashboard).
type LocationHappyHoursSectionProps = {
  locationName: string;
  happyHours: HappyHour[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function LocationHappyHoursSection({
  locationName,
  happyHours,
  isLoading,
  isError,
  error,
}: LocationHappyHoursSectionProps) {
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
        <HorizontalCardList accessibilityLabel="Happy Hours dieser Location">
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
