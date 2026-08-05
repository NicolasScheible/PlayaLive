import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Generische Trefferzeile für die globale Suche (Locations/Events/Artists). Strukturell an
// `ReviewListItem.tsx` angelehnt (schlichte Zeile mit unterer Trennlinie statt Card-Optik) — der
// einzige bestehende Zeilen-Stil im Projekt außerhalb der bildlastigen `LocationCard`/`EventCard`/
// `ArtistCard`, die für eine gemischte, textlastige Trefferliste nicht passen. `subtitle` ist optional,
// da nicht jeder Treffer eine sinnvolle Zeile hat (z. B. Artist ohne hinterlegte Genres).
type SearchResultRowProps = {
  title: string;
  subtitle?: string | null;
  onPress: () => void;
};

export function SearchResultRow({ title, subtitle, onPress }: SearchResultRowProps) {
  return (
    <Pressable style={styles.container} accessibilityRole="button" onPress={onPress}>
      <View style={styles.texts}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  texts: {
    gap: 4,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
