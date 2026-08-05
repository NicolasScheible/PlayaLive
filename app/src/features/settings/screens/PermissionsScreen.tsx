import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { SectionHeader } from '../../../components/SectionHeader';
import { useUserLocation } from '../../../hooks/useUserLocation';
import { theme } from '../../../theme/theme';
import { usePhotoLibraryPermission } from '../hooks/usePhotoLibraryPermission';
import type { PhotoLibraryPermissionStatus } from '../hooks/usePhotoLibraryPermission';

// Settings → Datenschutz → „Berechtigungen". Nutzt ausschließlich bereits bestehende Bausteine: den
// geteilten `useUserLocation`-Hook (Standort, bereits für Live-Karte/Community-Report im Einsatz) und
// den neuen, aber nach demselben Muster gebauten `usePhotoLibraryPermission`. `Linking.openSettings()`
// ist Teil des React-Native-Kerns (keine neue Abhängigkeit) — einzige Möglichkeit, eine bereits
// verweigerte Berechtigung erneut anzufragen (Plattform-Konvention, kein erneuter In-App-Prompt).
const STATUS_LABELS: Record<PhotoLibraryPermissionStatus, string> = {
  granted: 'Erlaubt',
  denied: 'Verweigert',
  undetermined: 'Nicht festgelegt',
};

export function PermissionsScreen() {
  const location = useUserLocation();
  const photoLibrary = usePhotoLibraryPermission();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View>
        <SectionHeader title="Standort" />
        <View style={styles.row}>
          <Text style={styles.status}>{STATUS_LABELS[location.status]}</Text>
          {location.status === 'undetermined' ? (
            <Button label="Erlauben" variant="secondary" onPress={location.requestPermission} />
          ) : null}
          {location.status === 'denied' ? (
            <Button
              label="Einstellungen öffnen"
              variant="secondary"
              onPress={() => Linking.openSettings()}
            />
          ) : null}
        </View>
      </View>

      <View>
        <SectionHeader title="Fotomediathek" />
        <View style={styles.row}>
          <Text style={styles.status}>{STATUS_LABELS[photoLibrary.status]}</Text>
          {photoLibrary.status === 'undetermined' ? (
            <Button label="Erlauben" variant="secondary" onPress={photoLibrary.requestPermission} />
          ) : null}
          {photoLibrary.status === 'denied' ? (
            <Button
              label="Einstellungen öffnen"
              variant="secondary"
              onPress={() => Linking.openSettings()}
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  row: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  status: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
});
