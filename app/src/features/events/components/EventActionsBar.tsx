import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/Button';
import { theme } from '../../../theme/theme';

// Aktionen gemäß Auftrag Punkt 7: „Route öffnen, Teilen, Favorit hinzufügen/entfernen. Keine
// Ticket-/Payment-Funktion, keine Reservierungen." Teilen und Favorit sind bereits als Icon-Buttons im
// Header umgesetzt (analog zu `LocationActionsBar.tsx`/`LocationDetailHeader.tsx`) — hier
// ausschließlich „Route öffnen" als Primary-Button. `onPress` als übergebener Callback statt eigenem
// `Linking`-Aufruf, damit diese rein visuelle Komponente ohne Plattform-API-Zugriff auskommt.
type EventActionsBarProps = {
  onPressRoute: () => void;
};

export function EventActionsBar({ onPressRoute }: EventActionsBarProps) {
  return (
    <View style={styles.container}>
      <Button label="Route öffnen" onPress={onPressRoute} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
  },
});
