import { StyleSheet, View } from 'react-native';

import { FilterChip } from '../../../components/FilterChip';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { useFilterStore } from '../../../store/filterStore';
import { theme } from '../../../theme/theme';
import type { LocationCategory, OccupancyLevel } from '../../../types/entities';

// Filter-Chip-Reihen gemäß docs/DesignSystem.md Kapitel 15 („Alle Locations", „Clubs & Bars" als
// Beispiel-Chips auf der Karte) — Kategorie und Auslastung als Einzelauswahl-Reihen mit „Alle" zum
// Zurücksetzen, „Geöffnet"/„Favoriten" als eigenständige Umschalt-Chips. Liest/schreibt ausschließlich
// über `filterStore` (Auftrag: „Filter ausschließlich über bestehende Stores"), keine eigene
// Filterlogik.
const CATEGORY_LABELS: Record<LocationCategory, string> = {
  club: 'Clubs',
  bar: 'Bars',
};

const OCCUPANCY_LABELS: Record<OccupancyLevel, string> = {
  low: 'Wenig los',
  medium: 'Gut besucht',
  high: 'Sehr voll',
};

export function FilterBar() {
  const category = useFilterStore((state) => state.category);
  const occupancyLevel = useFilterStore((state) => state.occupancyLevel);
  const openNow = useFilterStore((state) => state.openNow);
  const favoritesOnly = useFilterStore((state) => state.favoritesOnly);
  const setCategory = useFilterStore((state) => state.setCategory);
  const setOccupancyLevel = useFilterStore((state) => state.setOccupancyLevel);
  const setOpenNow = useFilterStore((state) => state.setOpenNow);
  const setFavoritesOnly = useFilterStore((state) => state.setFavoritesOnly);

  return (
    <View style={styles.container}>
      <HorizontalCardList accessibilityLabel="Nach Kategorie filtern">
        <FilterChip label="Alle" active={category === null} onPress={() => setCategory(null)} />
        {(Object.keys(CATEGORY_LABELS) as LocationCategory[]).map((value) => (
          <FilterChip
            key={value}
            label={CATEGORY_LABELS[value]}
            active={category === value}
            onPress={() => setCategory(value)}
          />
        ))}
      </HorizontalCardList>
      <HorizontalCardList accessibilityLabel="Nach Auslastung filtern">
        <FilterChip
          label="Alle Auslastungen"
          active={occupancyLevel === null}
          onPress={() => setOccupancyLevel(null)}
        />
        {(Object.keys(OCCUPANCY_LABELS) as OccupancyLevel[]).map((value) => (
          <FilterChip
            key={value}
            label={OCCUPANCY_LABELS[value]}
            active={occupancyLevel === value}
            onPress={() => setOccupancyLevel(value)}
          />
        ))}
        <FilterChip label="Geöffnet" active={openNow} onPress={() => setOpenNow(!openNow)} />
        <FilterChip
          label="Favoriten"
          active={favoritesOnly}
          onPress={() => setFavoritesOnly(!favoritesOnly)}
        />
      </HorizontalCardList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
});
