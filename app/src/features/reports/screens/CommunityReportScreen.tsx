import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { LoadingState } from '../../../components/LoadingState';
import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import type { OccupancyLevel } from '../../../types/entities';
import { CommunityReportForm } from '../components/CommunityReportForm';
import { ReportLocationSummary } from '../components/ReportLocationSummary';
import { ReportSuccessState } from '../components/ReportSuccessState';
import { useCommunityReportScreen } from '../hooks/useCommunityReportScreen';

// Vollständiger Community-Report-Screen (löst den bisherigen Platzhalter ab), orchestriert
// ausschließlich über `useCommunityReportScreen()` (CLAUDE.md → Vorgehensweise: keine Business-Logik/
// kein Datenzugriff im Screen, ausschließlich Hooks). Titel/Zurück-Button kommen vom nativen
// Stack-Header (`options={{ title: 'Melden' }}` in `MainNavigator.tsx`), analog zu `Favorites`/
// `Profile` — kein eigener Header-Baustein nötig. Auftrag Punkt 6 „automatischer Rücksprung": Timer im
// Screen (Navigation ist UI-Orchestrierung, keine Business-Logik), bereinigt beim Verlassen.
const SUCCESS_AUTO_RETURN_MS = 2000;

type CommunityReportScreenProps = NativeStackScreenProps<MainStackParamList, 'CommunityReport'>;
type CommunityReportNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'CommunityReport'
>;

export function CommunityReportScreen({ route }: CommunityReportScreenProps) {
  const navigation = useNavigation<CommunityReportNavigationProp>();
  const { locationId } = route.params;
  const screen = useCommunityReportScreen(locationId);
  const [selectedLevel, setSelectedLevel] = useState<OccupancyLevel | null>(null);

  useEffect(() => {
    if (!screen.report.isSuccess) {
      return;
    }

    const timer = setTimeout(() => navigation.goBack(), SUCCESS_AUTO_RETURN_MS);

    return () => clearTimeout(timer);
  }, [screen.report.isSuccess, navigation]);

  if (screen.isLoading) {
    return <LoadingState label="Location wird geladen" />;
  }

  if (screen.isError) {
    return (
      <ErrorState message={screen.error?.message ?? 'Die Location konnte nicht geladen werden.'} />
    );
  }

  if (screen.notFound || !screen.location) {
    return <EmptyState message="Diese Location wurde nicht gefunden." />;
  }

  if (screen.report.isSuccess) {
    return <ReportSuccessState />;
  }

  const location = screen.location;

  function handleSubmit() {
    if (selectedLevel === null || !screen.userLocation.coords) {
      return;
    }

    screen.report.createReport({
      locationId,
      occupancyLevel: selectedLevel,
      latitude: screen.userLocation.coords.latitude,
      longitude: screen.userLocation.coords.longitude,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ReportLocationSummary
        location={location}
        liveStatus={screen.liveStatus.liveStatus}
        isLiveStatusLoading={screen.liveStatus.isLoading}
        distanceMeters={screen.distanceMeters}
      />

      {screen.report.error ? <ErrorState message={screen.report.error.message} /> : null}

      <CommunityReportForm
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        onSubmit={handleSubmit}
        isSubmitting={screen.report.isSubmitting}
        isWithinGeofence={screen.isWithinGeofence}
        locationPermissionStatus={screen.userLocation.status}
        onRequestLocationPermission={screen.userLocation.requestPermission}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});
