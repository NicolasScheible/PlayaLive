import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Sterne-Bewertung gemäß docs/DesignSystem.md Kapitel 12 „ArtistCard": „Bewertung (Sterne + Anzahl)".
// `rating` wird auf die nächste ganze Zahl gerundet dargestellt (keine Halbsterne — im DesignSystem
// nicht dokumentiert, daher keine eigene Annahme darüber getroffen). `onChange` schaltet optional in
// den interaktiven Auswahlmodus (Review erstellen/bearbeiten) um — analog zum bestehenden Muster
// „bestehende, generische Komponente um optionalen Prop erweitern" (z. B. `SettingsRow`-Toggle).
const STAR_VALUES = [1, 2, 3, 4, 5];

type StarRatingProps = {
  rating: number;
  size?: number;
  onChange?: (value: number) => void;
};

export function StarRating({ rating, size = 16, onChange }: StarRatingProps) {
  const filledStars = Math.round(Math.min(5, Math.max(0, rating)));

  return (
    <View
      style={styles.row}
      accessibilityRole={onChange ? 'adjustable' : 'text'}
      accessibilityLabel={`${rating.toFixed(1)} von 5 Sternen`}
    >
      {STAR_VALUES.map((value) =>
        onChange ? (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={`${value} Sterne`}
            onPress={() => onChange(value)}
          >
            <Text
              style={[
                styles.star,
                { fontSize: size },
                value <= filledStars ? styles.filled : styles.empty,
              ]}
            >
              ★
            </Text>
          </Pressable>
        ) : (
          <Text
            key={value}
            style={[
              styles.star,
              { fontSize: size },
              value <= filledStars ? styles.filled : styles.empty,
            ]}
          >
            ★
          </Text>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  filled: {
    color: theme.colors.brand.primary,
  },
  empty: {
    color: theme.colors.border.subtle,
  },
});
