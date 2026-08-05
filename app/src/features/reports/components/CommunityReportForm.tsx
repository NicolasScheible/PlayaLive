import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import type { LocationPermissionStatus } from '../../../hooks/useUserLocation';
import { theme } from '../../../theme/theme';
import type { OccupancyLevel } from '../../../types/entities';

import { OccupancyLevelPicker } from './OccupancyLevelPicker';

// Formular gemäß Auftrag Punkt 1 („Formular zur Meldung") und Punkt 3 („Geofencing: Nur melden, wenn
// der Nutzer innerhalb der Distanz liegt — bereits vorhandene Services verwenden, keine neue
// Geofencing-Logik"). Die eigentliche Geofencing-Berechnung lebt im Hook (`useCommunityReportScreen`,
// bestehende `distanceMeters`-Utility) — diese Komponente ist rein präsentational und blendet je nach
// Standort-/Geofencing-Zustand entweder einen Hinweis oder das Auswahlformular ein, analog zum bereits
// etablierten „Standort aktivieren"-Hinweis auf `MapScreen.tsx`.
type CommunityReportFormProps = {
  selectedLevel: OccupancyLevel | null;
  onSelectLevel: (level: OccupancyLevel) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isWithinGeofence: boolean;
  locationPermissionStatus: LocationPermissionStatus;
  onRequestLocationPermission: () => void;
};

export function CommunityReportForm({
  selectedLevel,
  onSelectLevel,
  onSubmit,
  isSubmitting,
  isWithinGeofence,
  locationPermissionStatus,
  onRequestLocationPermission,
}: CommunityReportFormProps) {
  if (locationPermissionStatus === 'undetermined') {
    return (
      <View style={styles.container}>
        <Text style={styles.hint}>
          Aktiviere deinen Standort, um die Live-Auslastung dieser Location zu melden.
        </Text>
        <Button
          label="Standort aktivieren"
          variant="secondary"
          onPress={onRequestLocationPermission}
        />
      </View>
    );
  }

  if (locationPermissionStatus === 'denied') {
    return (
      <View style={styles.container}>
        <Text style={styles.hint}>
          Ohne Standortzugriff kannst du die Auslastung dieser Location nicht melden.
        </Text>
      </View>
    );
  }

  if (!isWithinGeofence) {
    return (
      <View style={styles.container}>
        <Text style={styles.hint}>
          Du bist zu weit von dieser Location entfernt, um sie zu melden. Komm näher heran und
          versuche es erneut.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Wie ist die Auslastung gerade?</Text>
      <OccupancyLevelPicker value={selectedLevel} onChange={onSelectLevel} />
      <Button
        label="Melden"
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={selectedLevel === null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
  hint: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
});
