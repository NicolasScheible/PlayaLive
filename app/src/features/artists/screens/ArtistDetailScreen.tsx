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
import { ArtistCurrentEventSection } from '../components/ArtistCurrentEventSection';
import { ArtistDetailHeader } from '../components/ArtistDetailHeader';
import { ArtistInfoSection } from '../components/ArtistInfoSection';
import { ArtistUpcomingEventsSection } from '../components/ArtistUpcomingEventsSection';
import { useArtistDetailScreen } from '../hooks/useArtistDetailScreen';

// Vollständiger Artist-Detail-Screen (löst den bisherigen Platzhalter ab), orchestriert ausschließlich
// über `useArtistDetailScreen()` (CLAUDE.md → Vorgehensweise: keine Business-Logik/kein Datenzugriff im
// Screen, ausschließlich Hooks). `Share`/`Linking` sind reine Plattform-API-Aufrufe ohne Datenzugriff,
// daher direkt hier verdrahtet (analog zu `EventDetailScreen.tsx`/`LocationDetailScreen.tsx`), nicht
// über einen Service. Keine `ArtistActionsBar`: Auftrag Punkt 6 nennt nur Teilen und Favorit — beide
// Aktionen sind bereits über die Buttons im Header abgedeckt (`ArtistDetailHeader`), eine zusätzliche,
// separate Aktionsleiste wäre eine redundante zweite Anzeige derselben zwei Aktionen.
type ArtistDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'ArtistDetail'>;
type ArtistDetailNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ArtistDetail'>;

export function ArtistDetailScreen({ route }: ArtistDetailScreenProps) {
  const navigation = useNavigation<ArtistDetailNavigationProp>();
  const { artistId } = route.params;
  const screen = useArtistDetailScreen(artistId);

  if (screen.isLoading) {
    return <LoadingState label="Künstler wird geladen" />;
  }

  if (screen.isError) {
    return (
      <ErrorState message={screen.error?.message ?? 'Der Künstler konnte nicht geladen werden.'} />
    );
  }

  if (screen.notFound || !screen.artist) {
    return <EmptyState message="Dieser Künstler wurde nicht gefunden." />;
  }

  const artist = screen.artist;

  function handleShare() {
    Share.share({ message: artist.name });
  }

  function handlePressLink(url: string) {
    Linking.openURL(url);
  }

  function handlePressEvent(eventId: string) {
    navigation.navigate('EventDetail', { eventId });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ArtistDetailHeader
        imageUrl={artist.image_url}
        name={artist.name}
        genres={artist.genres}
        isFavorited={screen.favorite.isFavorited}
        onToggleFavorite={screen.favorite.toggleFavorite}
        onPressBack={() => navigation.goBack()}
        onPressShare={handleShare}
      />

      <ArtistInfoSection
        bio={artist.bio}
        genres={artist.genres}
        instagramUrl={artist.instagram_url}
        spotifyUrl={artist.spotify_url}
        youtubeUrl={artist.youtube_url}
        tiktokUrl={artist.tiktok_url}
        onPressLink={handlePressLink}
      />

      {screen.currentEventDetail.eventDetail !== null || screen.currentEventDetail.isLoading ? (
        <ArtistCurrentEventSection
          eventDetail={screen.currentEventDetail.eventDetail}
          isLoading={screen.currentEventDetail.isLoading}
          onPress={handlePressEvent}
        />
      ) : null}

      <ArtistUpcomingEventsSection
        events={screen.upcomingEvents}
        isLoading={screen.isEventsLoading}
        isError={screen.isEventsError}
        error={screen.eventsError}
        onPressEvent={handlePressEvent}
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
    paddingBottom: theme.spacing.xl,
  },
});
