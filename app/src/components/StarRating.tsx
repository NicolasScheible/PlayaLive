import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Sterne-Bewertung gemäß docs/DesignSystem.md Kapitel 12 „ArtistCard": „Bewertung (Sterne + Anzahl)".
// `rating` wird auf die nächste ganze Zahl gerundet dargestellt (keine Halbsterne — im DesignSystem
// nicht dokumentiert, daher keine eigene Annahme darüber getroffen).
const STAR_VALUES = [1, 2, 3, 4, 5];

type StarRatingProps = {
  rating: number;
  size?: number;
};

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  const filledStars = Math.round(Math.min(5, Math.max(0, rating)));

  return (
    <View
      style={styles.row}
      accessibilityRole="text"
      accessibilityLabel={`${rating.toFixed(1)} von 5 Sternen`}
    >
      {STAR_VALUES.map((value) => (
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
      ))}
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
