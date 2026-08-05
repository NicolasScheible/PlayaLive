import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/Button';
import { theme } from '../../../theme/theme';

// Aktionen gemäß Auftrag Punkt 8: „Route öffnen, Teilen, Favorit hinzufügen/entfernen". Teilen und
// Favorit sind bereits als Icon-Buttons im Header umgesetzt (docs/DesignSystem.md Kapitel 11: „Teilen,
// Favoriten-Herz in den Headern von ... Detailscreens") — hier ausschließlich „Route öffnen" als
// Primary-Button, passend zum bereits dokumentierten Beispiel „Route anzeigen"
// (docs/DesignSystem.md Kapitel 11). Keine doppelte zweite Umsetzung derselben Aktionen, keine
// zusätzlichen, nicht beauftragten Funktionen. `onPress` als übergebener Callback statt eigenem
// `Linking`-Aufruf, damit diese rein visuelle Komponente ohne Plattform-API-Zugriff auskommt.
type LocationActionsBarProps = {
  onPressRoute: () => void;
};

export function LocationActionsBar({ onPressRoute }: LocationActionsBarProps) {
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
