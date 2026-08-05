import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import type { AppError } from '../../../lib/errors';
import { theme } from '../../../theme/theme';

// Generische vertikale Einspalten-Liste (docs/DesignSystem.md Kapitel 6: „Vertikale Einspalten-Listen
// für vollständige Übersichten: ... Favoriten" — im Unterschied zu den horizontalen Card-Karussells auf
// Home/Karte/Detail-Screens). Übernimmt ausschließlich Lade-/Fehler-/Leerzustand (Auftrag Punkte 6-8:
// bestehende `EmptyState`/`ErrorState`/`SkeletonBlock`, keine neue Skeleton-Komponente); die eigentliche
// Kartendarstellung je Favoriten-Typ liefert `renderItem` von den drei typisierten Listen-Komponenten
// (`FavoriteLocationsList`/`FavoriteEventsList`/`FavoriteArtistsList`) — diese Sektion selbst kennt
// weder Location/Event/Artist noch Navigation/Entfernen-Logik. Generisch über `<T>`, da alle drei
// Favoriten-Tabs (Auftrag Punkt 1) exakt dieselbe Lade-/Fehler-/Leer-Logik benötigen (CLAUDE.md „ab der
// 3. Verwendung").
const SKELETON_ROW_HEIGHT = 140;
const SKELETON_COUNT = 3;

type FavoriteListSectionProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  emptyMessage: string;
  loadingAccessibilityLabel: string;
  renderItem: (item: T) => ReactNode;
};

export function FavoriteListSection<T>({
  items,
  getKey,
  isLoading,
  isError,
  error,
  emptyMessage,
  loadingAccessibilityLabel,
  renderItem,
}: FavoriteListSectionProps<T>) {
  if (isLoading) {
    return (
      <View style={styles.list} accessibilityLabel={loadingAccessibilityLabel}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <SkeletonBlock key={index} width="100%" height={SKELETON_ROW_HEIGHT} />
        ))}
      </View>
    );
  }

  if (isError) {
    return <ErrorState message={error?.message ?? 'Favoriten konnten nicht geladen werden.'} />;
  }

  if (items.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={getKey(item)}>{renderItem(item)}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
});
