import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Linking, ScrollView, Share, StyleSheet } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { LoadingState } from '../../../components/LoadingState';
import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { isOpenNow } from '../../../utils/isOpenNow';
import { LocationActionsBar } from '../components/LocationActionsBar';
import { LocationDetailHeader } from '../components/LocationDetailHeader';
import { LocationHappyHoursSection } from '../components/LocationHappyHoursSection';
import { LocationInfoSection } from '../components/LocationInfoSection';
import { LocationLiveOccupancySection } from '../components/LocationLiveOccupancySection';
import { LocationReviewsSection } from '../components/LocationReviewsSection';
import { LocationSpecialsSection } from '../components/LocationSpecialsSection';
import { LocationTodayEventsSection } from '../components/LocationTodayEventsSection';
import { useLocationDetailScreen } from '../hooks/useLocationDetailScreen';

// Vollständiger Location-Detail-Screen (löst den bisherigen Platzhalter ab), orchestriert
// ausschließlich über `useLocationDetailScreen()` (CLAUDE.md → Vorgehensweise: keine
// Business-Logik/kein Datenzugriff im Screen, ausschließlich Hooks). `Linking`/`Share` sind reine
// Plattform-API-Aufrufe ohne Datenzugriff, daher direkt hier verdrahtet (analog zu
// `navigation.navigate(...)` in `HomeScreen.tsx`), nicht über einen Service.
type LocationDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'LocationDetail'>;
type LocationDetailNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LocationDetail'>;

export function LocationDetailScreen({ route }: LocationDetailScreenProps) {
  const navigation = useNavigation<LocationDetailNavigationProp>();
  const { locationId } = route.params;
  const screen = useLocationDetailScreen(locationId);

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

  const location = screen.location;

  function handleShare() {
    Share.share({ message: location.name });
  }

  function handleOpenRoute() {
    if (location.latitude === null || location.longitude === null) {
      return;
    }

    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
    );
  }

  function handlePressEvent(eventId: string) {
    navigation.navigate('EventDetail', { eventId });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LocationDetailHeader
        imageUrl={location.images[0] ?? null}
        locationName={location.name}
        category={location.category}
        occupancyLevel={screen.liveStatus.liveStatus?.occupancy_level ?? null}
        isOccupancyConfident={screen.liveStatus.liveStatus?.is_confident ?? false}
        distanceMeters={screen.distanceMeters}
        isFavorited={screen.favorite.isFavorited}
        onToggleFavorite={screen.favorite.toggleFavorite}
        onPressBack={() => navigation.goBack()}
        onPressShare={handleShare}
      />

      <LocationInfoSection
        name={location.name}
        description={location.description}
        address={location.address}
        openingHours={location.opening_hours}
        isOpen={isOpenNow(location.opening_hours)}
      />

      <LocationLiveOccupancySection
        liveStatus={screen.liveStatus.liveStatus}
        isLoading={screen.liveStatus.isLoading}
        isError={screen.liveStatus.isError}
        error={screen.liveStatus.error}
      />

      <LocationHappyHoursSection
        locationName={location.name}
        happyHours={screen.happyHours.happyHours}
        isLoading={screen.happyHours.isLoading}
        isError={screen.happyHours.isError}
        error={screen.happyHours.error}
      />

      <LocationSpecialsSection
        locationName={location.name}
        specials={screen.specials.specials}
        isLoading={screen.specials.isLoading}
        isError={screen.specials.isError}
        error={screen.specials.error}
      />

      <LocationTodayEventsSection
        locationName={location.name}
        events={screen.todayEvents.events}
        isLoading={screen.todayEvents.isLoading}
        isError={screen.todayEvents.isError}
        error={screen.todayEvents.error}
        onPressEvent={handlePressEvent}
      />

      <LocationReviewsSection
        averageRating={screen.reviews.averageRating}
        reviewCount={screen.reviews.reviewCount}
        reviews={screen.reviews.reviews}
        isLoading={screen.reviews.isLoading}
        isError={screen.reviews.isError}
        error={screen.reviews.error}
      />

      <LocationActionsBar onPressRoute={handleOpenRoute} />
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
    paddingBottom: theme.spacing.xl,
  },
});
