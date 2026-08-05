import { StyleSheet, View } from 'react-native';

import { FilterChip } from '../../../components/FilterChip';
import { theme } from '../../../theme/theme';
import type { OccupancyLevel } from '../../../types/entities';

// Auswahl gemäß Auftrag Punkt 2: „Nutzer kann ausschließlich wählen: Wenig los / Gut besucht / Sehr
// voll. Keine Prozentwerte. Keine Freitexte." Über das bereits bestehende, generische `FilterChip`
// umgesetzt (aktiv/inaktiv-Muster bereits etabliert, z. B. `FilterBar.tsx`) — keine neue
// Auswahl-Komponente. Labels identisch zu `FilterBar.tsx`s `OCCUPANCY_LABELS`/`OccupancyBadge.tsx`s
// `LEVEL_LABELS` (dieselbe Bedeutung, hier erneut lokal definiert statt cross-feature importiert,
// features/README.md).
const OCCUPANCY_LEVEL_LABELS: Record<OccupancyLevel, string> = {
  low: 'Wenig los',
  medium: 'Gut besucht',
  high: 'Sehr voll',
};

type OccupancyLevelPickerProps = {
  value: OccupancyLevel | null;
  onChange: (value: OccupancyLevel) => void;
};

export function OccupancyLevelPicker({ value, onChange }: OccupancyLevelPickerProps) {
  return (
    <View style={styles.container}>
      {(Object.keys(OCCUPANCY_LEVEL_LABELS) as OccupancyLevel[]).map((level) => (
        <FilterChip
          key={level}
          label={OCCUPANCY_LEVEL_LABELS[level]}
          active={value === level}
          onPress={() => onChange(level)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
});
