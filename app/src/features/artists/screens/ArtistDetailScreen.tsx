import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';

// Platzhalter für den Artist-Detail-Screen (docs/DesignSystem.md Kapitel 17: eigener Stack-Screen,
// kein Modal). Nicht Teil des Event-Detail-Auftrags („Nicht implementieren: Artist Detail ... genügt
// vorerst der vorhandene Platzhalter") — dient hier ausschließlich als Navigationsziel für die
// „Künstler"-Liste im Event-Detail-Screen.
type ArtistDetailScreenProps = NativeStackScreenProps<MainStackParamList, 'ArtistDetail'>;

export function ArtistDetailScreen({ route }: ArtistDetailScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Künstler-Details folgen in Kürze.</Text>
      <Text style={styles.artistId}>{route.params.artistId}</Text>
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
  artistId: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
