import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/Button';
import { theme } from '../../../theme/theme';

// Schnellzugriff auf die Karte gemäß docs/PRD.md Kapitel 10 (Home: „Einstieg in Live Map"). `onPress`
// bleibt ein vom aufrufenden Screen übergebener Callback statt fest verdrahteter Navigation (keine
// Business-Logik/Navigationsimport in dieser rein visuellen Komponente) — `HomeScreen.tsx` verdrahtet
// ihn mit `navigation.navigate('Map')`.
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
