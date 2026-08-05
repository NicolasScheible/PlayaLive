import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme/theme';

// Künstlerinformationen gemäß Auftrag Punkt 3: „Beschreibung/Biografie, Genres, Social Links (nur
// falls bereits im Datenmodell vorhanden), Verifizierung nur falls bereits vorhanden. Keine Felder
// erfinden." Verifizierung ist bewusst nicht Teil dieser Komponente — die `artists`-Tabelle
// (supabase/migrations/20260804122718_artists.sql) hat kein Verifizierungs-Feld. Social Links werden
// nur für tatsächlich gesetzte URLs gerendert; `onPressLink` öffnet die URL (Plattform-API-Aufruf lebt
// im Screen, siehe `ArtistDetailScreen.tsx`, analog zu `Linking`/`Share` in den bisherigen
// Detail-Screens) — diese Komponente bleibt dadurch ohne eigenen Plattform-API-Zugriff.
type SocialLinkKey = 'instagram' | 'spotify' | 'youtube' | 'tiktok';

const SOCIAL_LINK_LABELS: Record<SocialLinkKey, string> = {
  instagram: 'Instagram',
  spotify: 'Spotify',
  youtube: 'YouTube',
  tiktok: 'TikTok',
};

type ArtistInfoSectionProps = {
  bio: string | null;
  genres: string[];
  instagramUrl: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  onPressLink: (url: string) => void;
};

export function ArtistInfoSection({
  bio,
  genres,
  instagramUrl,
  spotifyUrl,
  youtubeUrl,
  tiktokUrl,
  onPressLink,
}: ArtistInfoSectionProps) {
  const links: Record<SocialLinkKey, string | null> = {
    instagram: instagramUrl,
    spotify: spotifyUrl,
    youtube: youtubeUrl,
    tiktok: tiktokUrl,
  };
  const availableLinks = (Object.keys(links) as SocialLinkKey[]).filter(
    (key) => links[key] !== null,
  );

  return (
    <View style={styles.container}>
      {bio ? <Text style={styles.bio}>{bio}</Text> : null}

      {genres.length > 0 ? (
        <View style={styles.row}>
          <Text style={styles.label}>Genres</Text>
          <Text style={styles.value}>{genres.join(', ')}</Text>
        </View>
      ) : null}

      {availableLinks.length > 0 ? (
        <View style={styles.linksRow}>
          {availableLinks.map((key) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              onPress={() => onPressLink(links[key] as string)}
              style={styles.linkButton}
            >
              <Text style={styles.linkLabel}>{SOCIAL_LINK_LABELS[key]}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  bio: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  value: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  linkButton: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.brand.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  linkLabel: {
    color: theme.colors.brand.primary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
});
