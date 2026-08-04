import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';

// Platzhalter für den Location-Detail-Screen (docs/DesignSystem.md Kapitel 17: eigener Stack-Screen,
// kein Modal). Nicht Teil des Live-Map-Auftrags („Nicht implementieren: ... Falls ein
// 'Details'-Button benötigt wird, genügt vorerst ... ein Platzhalter, sofern der Detail-Screen noch
// nicht existiert") — dient hier ausschließlich als Navigationsziel für den „Details"-Button im
// Live-Map-Bottom-Sheet.
type LocationDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'LocationDetail'>;

export function LocationDetailScreen({ route }: LocationDetailScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Location-Details folgen in Kürze.</Text>
      <Text style={styles.locationId}>{route.params.locationId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.base,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  message: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
  },
  locationId: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
