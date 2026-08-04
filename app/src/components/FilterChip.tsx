import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme/theme';

// Filter-Chip gemäß docs/DesignSystem.md Kapitel 15 „Chips": „Aktiver Chip: voll in Markenfarbe
// gefüllt, weißer Text. Inaktiver Chip: dunkler Fond mit Rahmen/Outline." Generisch/parametrisiert für
// beliebige Filter-Werte (Kategorie, Auslastung, „geöffnet", Favoriten, künftig auch Events/Künstler) —
// keine Business-Logik, der aufrufende Code entscheidet über `active`/`onPress`.
type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.base, active ? styles.active : styles.inactive]}
    >
      <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radius.pill,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  active: {
    backgroundColor: theme.colors.brand.primary,
  },
  inactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  label: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
  activeLabel: {
    color: theme.colors.text.primary,
  },
  inactiveLabel: {
    color: theme.colors.text.secondary,
  },
});
