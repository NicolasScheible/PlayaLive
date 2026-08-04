import { StyleSheet, Text } from 'react-native';

import { theme } from '../theme/theme';

// Section-Label gemäß docs/DesignSystem.md Kapitel 4 „Section-Labels in Versalien mit
// Buchstabenabstand" (z. B. „LIVE AUSLASTUNG", „SPIELT GERADE", „HIGHLIGHTS HEUTE", „HAPPY HOURS").
// Exaktes Letter-Spacing ist dort als offene Designentscheidung markiert — hier mit einem moderaten,
// plausiblen Wert umgesetzt statt ganz wegzulassen.
type SectionHeaderProps = {
  title: string;
};

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <Text style={styles.title} accessibilityRole="header">
      {title.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    letterSpacing: 1.2,
    paddingHorizontal: theme.spacing.md,
  },
});
