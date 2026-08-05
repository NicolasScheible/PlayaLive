import { FilterChip } from '../../../components/FilterChip';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import type { FavoritesTab } from '../hooks/useFavoritesScreen';

// Tabs gemäß Auftrag Punkt 1 („Locations", „Events", „Artists"). Über das bereits bestehende, generische
// `FilterChip` umgesetzt (docs/DesignSystem.md Kapitel 15 „Chips": aktiver Chip voll in Markenfarbe,
// inaktiver mit Rahmen — bereits das etablierte Muster für Auswahl-Reihen, siehe `FilterBar.tsx`), in
// `HorizontalCardList` (bestehender Container für horizontale Reihen mit einheitlichem Innenabstand) —
// keine neue Tab-Komponente, keine Inline-Styles.
const TAB_LABELS: Record<FavoritesTab, string> = {
  location: 'Locations',
  event: 'Events',
  artist: 'Artists',
};

type FavoritesTabsProps = {
  activeTab: FavoritesTab;
  onSelectTab: (tab: FavoritesTab) => void;
};

export function FavoritesTabs({ activeTab, onSelectTab }: FavoritesTabsProps) {
  return (
    <HorizontalCardList accessibilityLabel="Favoriten-Kategorie wählen">
      {(Object.keys(TAB_LABELS) as FavoritesTab[]).map((tab) => (
        <FilterChip
          key={tab}
          label={TAB_LABELS[tab]}
          active={activeTab === tab}
          onPress={() => onSelectTab(tab)}
        />
      ))}
    </HorizontalCardList>
  );
}
