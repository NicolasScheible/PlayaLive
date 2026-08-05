import { Pressable, StyleSheet, View } from 'react-native';

import { ArtistCard } from '../../../components/ArtistCard';
import { IconButton } from '../../../components/IconButton';
import type { AppError } from '../../../lib/errors';
import type { Artist } from '../../../types/entities';

import { FavoriteListSection } from './FavoriteListSection';

// Karten gemäß Auftrag Punkt 3: bestehende `ArtistCard` unverändert wiederverwendet. Entfernen über das
// etablierte Favoriten-Herz-Muster, analog zu `FavoriteLocationsList`/`FavoriteEventsList`.
type FavoriteArtistsListProps = {
  artists: Artist[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onPressArtist: (artistId: string) => void;
  onRemove: (artistId: string) => void;
};

export function FavoriteArtistsList({
  artists,
  isLoading,
  isError,
  error,
  onPressArtist,
  onRemove,
}: FavoriteArtistsListProps) {
  return (
    <FavoriteListSection
      items={artists}
      getKey={(artist) => artist.id}
      isLoading={isLoading}
      isError={isError}
      error={error}
      emptyMessage="Du hast noch keine Künstler favorisiert."
      loadingAccessibilityLabel="Favorisierte Künstler werden geladen"
      renderItem={(artist) => (
        <View style={styles.row}>
          <Pressable onPress={() => onPressArtist(artist.id)} accessibilityRole="button">
            <ArtistCard name={artist.name} imageUrl={artist.image_url} genres={artist.genres} />
          </Pressable>
          <IconButton
            glyph="♥"
            accessibilityLabel="Aus Favoriten entfernen"
            onPress={() => onRemove(artist.id)}
            active
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
