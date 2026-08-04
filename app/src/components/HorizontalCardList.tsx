import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { theme } from '../theme/theme';

// Generisches horizontales Karussell (docs/DesignSystem.md Kapitel 6 „Grid-System": „Horizontale
// Card-Karussells (scrollbare Reihen) für kuratierte/featured Inhalte" — Live Auslastung, Highlights
// heute, Happy Hours auf dem Home Dashboard).
type HorizontalCardListProps = {
  children: ReactNode;
  accessibilityLabel: string;
};

export function HorizontalCardList({ children, accessibilityLabel }: HorizontalCardListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
});
