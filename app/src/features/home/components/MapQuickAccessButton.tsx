import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/Button';
import { theme } from '../../../theme/theme';

// Schnellzugriff auf die Karte gemäß docs/PRD.md Kapitel 10 (Home: „Einstieg in Live Map"). Der
// Map-Screen selbst ist nicht Teil dieses Auftrags (siehe Zusammenfassung) — `onPress` ist daher ein
// vom aufrufenden Screen übergebener Callback statt fest verdrahteter Navigation, damit hier kein
// Navigationsziel erfunden wird, das noch nicht existiert.
type MapQuickAccessButtonProps = {
  onPress: () => void;
};

export function MapQuickAccessButton({ onPress }: MapQuickAccessButtonProps) {
  return (
    <View style={styles.container}>
      <Button label="Zur Karte" variant="secondary" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
  },
});
