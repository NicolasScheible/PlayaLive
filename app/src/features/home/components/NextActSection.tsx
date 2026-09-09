import { StyleSheet, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { EventCard } from '../../../components/EventCard';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import type { AppError } from '../../../lib/errors';
import { theme } from '../../../theme/theme';
import type { EventWithLocationName } from '../hooks/useCurrentActs';

// „Nächster Act" gemäß docs/PRD.md Kapitel 10. Ohne Countdown-Timer (docs/DesignSystem.md Kapitel 20:
// „Std:Min:Sek"-Timer ist dort nur eine 🟡 Beobachtung, keine bestätigte Anforderung) — stattdessen die
// Startzeit als Uhrzeit, konsistent mit allen anderen Event-Anzeigen dieses Screens.
type NextActSectionProps = {
  nextAct: EventWithLocationName | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onRetry?: () => void;
};

export function NextActSection({
  nextAct,
  isLoading,
  isError,
  error,
  onRetry,
}: NextActSectionProps) {
  return (
    <>
      <SectionHeader title="Nächster Act" />
      {isLoading ? (
        <View style={styles.container}>
          <SkeletonBlock width={200} height={140} />
        </View>
      ) : isError ? (
        <ErrorState
          message={error?.message ?? 'Der nächste Act konnte nicht geladen werden.'}
          onRetry={onRetry}
        />
      ) : !nextAct ? (
        <EmptyState message="Aktuell ist kein weiteres Event angekündigt." />
      ) : (
        <View style={styles.container}>
          <EventCard
            title={nextAct.title}
            locationName={nextAct.locationName}
            startTime={nextAct.start_time}
            imageUrl={nextAct.image_url}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
  },
});
