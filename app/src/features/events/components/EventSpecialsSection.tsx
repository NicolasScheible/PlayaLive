import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonRow } from '../../../components/SkeletonRow';
import { SpecialCard } from '../../../components/SpecialCard';
import type { AppError } from '../../../lib/errors';
import type { Special } from '../../../types/entities';

// Specials der Event-Location gemäß Auftrag Punkt 6 — aufgelöst über die bestehende
// Location-Beziehung, siehe `useEventLocationSpecials.ts`. Struktur identisch zu
// `LocationSpecialsSection.tsx` (Location-Detail-Feature), hier als eigenständige Datei statt eines
// Feature-übergreifenden Imports (features/README.md: „nie direkt auf ein anderes Feature-Modul").
type EventSpecialsSectionProps = {
  locationName: string;
  specials: Special[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function EventSpecialsSection({
  locationName,
  specials,
  isLoading,
  isError,
  error,
}: EventSpecialsSectionProps) {
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
        <HorizontalCardList accessibilityLabel="Specials am Veranstaltungsort">
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
