import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet } from 'react-native';

import type { MainDrawerParamList, MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { FavoriteArtistsList } from '../components/FavoriteArtistsList';
import { FavoriteEventsList } from '../components/FavoriteEventsList';
import { FavoriteLocationsList } from '../components/FavoriteLocationsList';
import { FavoritesTabs } from '../components/FavoritesTabs';
import { useFavoritesScreen } from '../hooks/useFavoritesScreen';

// „Favorites" ist seit der finalen Drawer-Navigation ein Screen des verschachtelten
// `MainDrawerNavigator` (siehe navigation/types.ts) — Navigation zu den Detail-Screens bleibt auf der
// übergeordneten Stack-Ebene, daher die zusammengesetzte Navigation-Prop (analog zu HomeScreen.tsx).
type FavoritesScreenNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<MainDrawerParamList, 'Favorites'>,
  NativeStackNavigationProp<MainStackParamList>
>;

// Favoriten-Screen (löst den bisherigen Platzhalter-Ordner ab) — orchestriert ausschließlich über
// `useFavoritesScreen()` (CLAUDE.md → Vorgehensweise: keine Business-Logik/Datenzugriff im Screen,
// ausschließlich Hooks). Titel/Menü-Icon kommen vom automatischen Drawer-Header
// (`options={{ title: 'Favoriten' }}` in `MainDrawerNavigator.tsx`) — kein eigener Header-Baustein
// nötig. Nur der aktive Tab wird gerendert, die anderen beiden laden ohnehin nicht
// (`useFavoritesScreen`s `enabled`-Flags) — kein unnötiger Render toter Listen.
export function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const screen = useFavoritesScreen();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <FavoritesTabs activeTab={screen.activeTab} onSelectTab={screen.setActiveTab} />

      {screen.activeTab === 'location' ? (
        <FavoriteLocationsList
          locations={screen.locations.items}
          isLoading={screen.locations.isLoading}
          isError={screen.locations.isError}
          error={screen.locations.error}
          onPressLocation={(locationId) => navigation.navigate('LocationDetail', { locationId })}
          onRemove={screen.locations.remove}
        />
      ) : null}

      {screen.activeTab === 'event' ? (
        <FavoriteEventsList
          events={screen.events.items}
          isLoading={screen.events.isLoading}
          isError={screen.events.isError}
          error={screen.events.error}
          onPressEvent={(eventId) => navigation.navigate('EventDetail', { eventId })}
          onRemove={screen.events.remove}
        />
      ) : null}

      {screen.activeTab === 'artist' ? (
        <FavoriteArtistsList
          artists={screen.artists.items}
          isLoading={screen.artists.isLoading}
          isError={screen.artists.isError}
          error={screen.artists.error}
          onPressArtist={(artistId) => navigation.navigate('ArtistDetail', { artistId })}
          onRemove={screen.artists.remove}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
});
