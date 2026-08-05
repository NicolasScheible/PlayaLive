import { Image, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Künstler-Card (docs/DesignSystem.md Kapitel 21: „Kreisrunde Bilder für Künstler-/Profilbilder
// (Avatare)" — anders als die rechteckigen `CardImage`-Bilder von Location-/Event-/HappyHour-Cards,
// daher kein `CardImage`-Reuse hier). Bewusst reduziert gegenüber der in Kapitel 12 dokumentierten
// vollen „ArtistCard" (Bild, Name, Verifizierungs-Häkchen, Genre, Bewertung, Event-/Location-Anzahl,
// Social-Icons): Verifizierungs-Häkchen, Bewertung und Event-/Location-Anzahl existieren nicht im
// Datenmodell (`artists`-Tabelle) — nur tatsächlich vorhandene Felder (Bild, Name, Genres) werden
// angezeigt, analog zur bereits reduzierten Umsetzung von `LocationCard`/`EventCard`.
const AVATAR_SIZE = 96;

type ArtistCardProps = {
  name: string;
  imageUrl: string | null;
  genres: string[];
};

export function ArtistCard({ name, imageUrl, genres }: ArtistCardProps) {
  return (
    <View style={styles.container} accessible accessibilityLabel={name}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.avatar} resizeMode="cover" />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.placeholderLabel}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      {genres.length > 0 ? (
        <Text style={styles.genres} numberOfLines={1}>
          {genres.join(', ')}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: AVATAR_SIZE,
    alignItems: 'center',
    gap: 4,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: theme.colors.border.subtle,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '700',
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  genres: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
    textAlign: 'center',
  },
});
