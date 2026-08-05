import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import { SpecialCard } from '../../../components/SpecialCard';
import type { AppError } from '../../../lib/errors';
import type { Special } from '../../../types/entities';

// Specials gemäß Auftrag Punkt 5 — Datenzugriff bereits im Hook (`useLocationSpecials`) auf aktive
// Einträge eingeschränkt. Struktur identisch zu `SpecialsSection.tsx` (Home Dashboard).
type LocationSpecialsSectionProps = {
  locationName: string;
  specials: Special[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function LocationSpecialsSection({
  locationName,
  specials,
  isLoading,
  isError,
  error,
}: LocationSpecialsSectionProps) {
  return (
    <>
      <SectionHeader title="Specials" />
      {isLoading ? (
        <SkeletonRow accessibilityLabel="Specials werden geladen" />
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Specials konnten nicht geladen werden.'} />
      ) : specials.length === 0 ? (
        <EmptyState message="Aktuell sind keine Specials eingetragen." />
      ) : (
        <HorizontalCardList accessibilityLabel="Specials dieser Location">
          {specials.map((special) => (
            <SpecialCard
              key={special.id}
              locationName={locationName}
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
