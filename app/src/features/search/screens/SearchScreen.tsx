import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { LoadingState } from '../../../components/LoadingState';
import { SearchResultRow } from '../../../components/SearchResultRow';
import { SectionHeader } from '../../../components/SectionHeader';
import { TextField } from '../../../components/TextField';
import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import type { Artist, Event, Location, LocationCategory } from '../../../types/entities';
import { formatDateFromTimestamp, formatTime } from '../../../utils/formatDateTime';
import { useGlobalSearch } from '../hooks/useGlobalSearch';

// Vollständiger Suchscreen (Auftrag Punkt 1), orchestriert ausschließlich über `useGlobalSearch()`
// (CLAUDE.md → Vorgehensweise: keine Business-Logik/kein Datenzugriff im Screen, ausschließlich Hooks).
// Suchfeld über die bestehende, generische `TextField`-Komponente (Auftrag Punkt 7 „keine neuen
// Komponenten falls bestehende verwendet werden können") — Live Search: `query`/`setQuery` sind
// ungedrosselt für sofortiges Tipp-Feedback, das Debouncing (Auftrag Punkt 3) findet im Hook statt.
// Getrennte Bereiche (Auftrag Punkt 4): nur Bereiche mit tatsächlichen Treffern werden gerendert.
const CATEGORY_LABELS: Record<LocationCategory, string> = {
  club: 'Club',
  bar: 'Bar',
};

type SearchScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Search'>;

export function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const search = useGlobalSearch();

  function handlePressLocation(location: Location) {
    navigation.navigate('LocationDetail', { locationId: location.id });
  }

  function handlePressEvent(event: Event) {
    navigation.navigate('EventDetail', { eventId: event.id });
  }

  function handlePressArtist(artist: Artist) {
    navigation.navigate('ArtistDetail', { artistId: artist.id });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchField}>
        <TextField
          label="Suche"
          value={search.query}
          onChangeText={search.setQuery}
          placeholder="Locations, Events, Künstler durchsuchen"
          autoCapitalize="none"
        />
      </View>

      {!search.isQueryPresent ? (
        <Text style={styles.hint}>Suche nach Locations, Events oder Künstlern.</Text>
      ) : search.isLoading ? (
        <LoadingState label="Suche läuft" />
      ) : search.isError ? (
        <ErrorState message={search.error?.message ?? 'Die Suche ist fehlgeschlagen.'} />
      ) : search.isEmpty ? (
        <EmptyState message="Keine Ergebnisse gefunden." />
      ) : (
        <ScrollView contentContainerStyle={styles.results}>
          {search.locations.length > 0 ? (
            <View>
              <SectionHeader title="Locations" />
              {search.locations.map((location) => (
                <SearchResultRow
                  key={location.id}
                  title={location.name}
                  subtitle={CATEGORY_LABELS[location.category]}
                  onPress={() => handlePressLocation(location)}
                />
              ))}
            </View>
          ) : null}

          {search.events.length > 0 ? (
            <View>
              <SectionHeader title="Events" />
              {search.events.map((event) => (
                <SearchResultRow
                  key={event.id}
                  title={event.title}
                  subtitle={`${formatDateFromTimestamp(event.start_time)} · ${formatTime(event.start_time)}`}
                  onPress={() => handlePressEvent(event)}
                />
              ))}
            </View>
          ) : null}

          {search.artists.length > 0 ? (
            <View>
              <SectionHeader title="Künstler" />
              {search.artists.map((artist) => (
                <SearchResultRow
                  key={artist.id}
                  title={artist.name}
                  subtitle={artist.genres.length > 0 ? artist.genres.join(', ') : null}
                  onPress={() => handlePressArtist(artist)}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  searchField: {
    padding: theme.spacing.md,
  },
  hint: {
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  results: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});
