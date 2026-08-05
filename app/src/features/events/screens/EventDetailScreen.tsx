import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';

// Platzhalter für den Event-Detail-Screen (docs/DesignSystem.md Kapitel 17: eigener Stack-Screen,
// kein Modal). Nicht Teil des Location-Detail-Auftrags („Nicht implementieren: Event Detail ... genügt
// vorerst ein Platzhalter-Screen") — dient hier ausschließlich als Navigationsziel für die
// „Heutige Events"-Vorschau im Location-Detail-Screen.
type EventDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'EventDetail'>;

export function EventDetailScreen({ route }: EventDetailScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Event-Details folgen in Kürze.</Text>
      <Text style={styles.eventId}>{route.params.eventId}</Text>
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
  eventId: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
