import { StyleSheet, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import type { AppError } from '../../../lib/errors';
import { theme } from '../../../theme/theme';
import type { OwnReportWithLocationName } from '../hooks/useOwnReports';

import { OwnReportListItem } from './OwnReportListItem';

const SKELETON_ROW_HEIGHT = 80;
const SKELETON_COUNT = 2;

// Eigene Community Reports gemäß Auftrag Punkt 5 — reine Anzeigeliste, keine Navigation (im Auftrag nur
// für Reviews verlangt, nicht für Reports).
type OwnReportsSectionProps = {
  reports: OwnReportWithLocationName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function OwnReportsSection({ reports, isLoading, isError, error }: OwnReportsSectionProps) {
  return (
    <>
      <SectionHeader title="Eigene Reports" />
      {isLoading ? (
        <View style={styles.list} accessibilityLabel="Eigene Reports werden geladen">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <SkeletonBlock key={index} width="100%" height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Reports konnten nicht geladen werden.'} />
      ) : reports.length === 0 ? (
        <EmptyState message="Du hast noch keine Reports abgegeben." />
      ) : (
        <View style={styles.list}>
          {reports.map((report) => (
            <OwnReportListItem key={report.id} report={report} />
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.md,
  },
});
