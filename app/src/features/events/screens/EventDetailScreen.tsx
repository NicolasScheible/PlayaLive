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
import { EventActionsBar } from '../components/EventActionsBar';
import { EventArtistsSection } from '../components/EventArtistsSection';
import { EventDetailHeader } from '../components/EventDetailHeader';
import { EventHappyHoursSection } from '../components/EventHappyHoursSection';
import { EventInfoSection } from '../components/EventInfoSection';
import { EventLocationSection } from '../components/EventLocationSection';
import { EventSpecialsSection } from '../components/EventSpecialsSection';
import { useEventDetailScreen } from '../hooks/useEventDetailScreen';

// Vollständiger Event-Detail-Screen (löst den bisherigen Platzhalter ab), orchestriert ausschließlich
// über `useEventDetailScreen()` (CLAUDE.md → Vorgehensweise: keine Business-Logik/kein Datenzugriff im
// Screen, ausschließlich Hooks). `Linking`/`Share` sind reine Plattform-API-Aufrufe ohne Datenzugriff,
// daher direkt hier verdrahtet (analog zu `LocationDetailScreen.tsx`), nicht über einen Service.
type EventDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'EventDetail'>;
type EventDetailNavigationProp = NativeStackNavigationProp<MainStackParamList, 'EventDetail'>;

export function EventDetailScreen({ route }: EventDetailScreenProps) {
  const navigation = useNavigation<EventDetailNavigationProp>();
  const { eventId } = route.params;
  const screen = useEventDetailScreen(eventId);

  if (screen.isLoading) {
    return <LoadingState label="Event wird geladen" />;
  }

  if (screen.isError) {
    return (
      <ErrorState message={screen.error?.message ?? 'Das Event konnte nicht geladen werden.'} />
    );
  }

  if (screen.notFound || !screen.event) {
    return <EmptyState message="Dieses Event wurde nicht gefunden." />;
  }

  const event = screen.event;
  const location = event.location;

  function handleShare() {
    Share.share({ message: event.title });
  }

  function handleOpenRoute() {
    if (location.latitude === null || location.longitude === null) {
      return;
    }

    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`,
    );
  }

  function handlePressLocation() {
    navigation.navigate('LocationDetail', { locationId: location.id });
  }

  function handlePressArtist(artistId: string) {
    navigation.navigate('ArtistDetail', { artistId });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <EventDetailHeader
        imageUrl={event.image_url}
        title={event.title}
        startTime={event.start_time}
        locationCategory={location.category}
        isFavorited={screen.favorite.isFavorited}
        onToggleFavorite={screen.favorite.toggleFavorite}
        onPressBack={() => navigation.goBack()}
        onPressShare={handleShare}
      />

      <EventInfoSection
        description={event.description}
        startTime={event.start_time}
        endTime={event.end_time}
        locationName={location.name}
        distanceMeters={screen.distanceMeters}
      />

      <EventLocationSection
        location={location}
        liveStatus={screen.liveStatus.liveStatus}
        onPress={handlePressLocation}
      />

      <EventArtistsSection artists={event.artists} onPressArtist={handlePressArtist} />

      <EventHappyHoursSection
        locationName={location.name}
        happyHours={screen.happyHours.happyHours}
        isLoading={screen.happyHours.isLoading}
        isError={screen.happyHours.isError}
        error={screen.happyHours.error}
      />

      <EventSpecialsSection
        locationName={location.name}
        specials={screen.specials.specials}
        isLoading={screen.specials.isLoading}
        isError={screen.specials.isError}
        error={screen.specials.error}
      />

      <EventActionsBar onPressRoute={handleOpenRoute} />
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
