import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { SettingsRow } from '../components/SettingsRow';
import { SettingsSection } from '../components/SettingsSection';
import { useSettingsScreen } from '../hooks/useSettingsScreen';

// Vollständiger Settings-Screen (löst den bisherigen Platzhalter ab), orchestriert ausschließlich über
// `useSettingsScreen()` (CLAUDE.md → Vorgehensweise: keine Business-Logik/kein Datenzugriff im
// Screen, ausschließlich Hooks). Titel/Zurück-Button kommen vom nativen Stack-Header (analog zu
// `Favorites`/`Profile`/`CommunityReport`).
//
// Mehrere im Auftrag geforderte Einträge (Konto löschen/deaktivieren, Datenexport,
// Datenschutzerklärung, Impressum, Nutzungsbedingungen, Hilfe, Feedback senden, App bewerten) haben
// weder eine bestehende Backend-Funktion (DSGVO-Löschung/-Export erfordern laut
// docs/Architecture.md Kapitel 17 eine Service-Role-Funktion bzw. eine noch offene Aufbewahrungs-/
// Exportformat-Entscheidung — dort selbst als vor der Implementierung zu klärender Punkt markiert) noch
// eine echte Ziel-URL/Kontaktadresse im Repo — nach Rückfrage werden sie als ehrliche „Demnächst
// verfügbar"-Hinweise über das native `Alert` (keine neue Abhängigkeit, kein neuer Dialog-Mechanismus)
// dargestellt, nicht als funktionslose/erfundene Links oder stillschweigend weggelassen.
type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Settings'>;

function showComingSoon(label: string) {
  Alert.alert(label, 'Diese Funktion ist noch nicht verfügbar.');
}

export function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { email, isEmailVerified } = useSettingsScreen();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsSection title="Konto">
        <SettingsRow label="Profil bearbeiten" onPress={() => navigation.navigate('Profile')} />
        <SettingsRow
          label="Passwort ändern"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        {email ? <SettingsRow label="E-Mail" value={email} /> : null}
        <SettingsRow
          label="E-Mail-Verifizierung"
          value={isEmailVerified ? 'Bestätigt' : 'Nicht bestätigt'}
        />
        <SettingsRow
          label="Konto deaktivieren"
          onPress={() => showComingSoon('Konto deaktivieren')}
        />
        <SettingsRow label="Konto löschen" onPress={() => showComingSoon('Konto löschen')} />
      </SettingsSection>

      <SettingsSection title="App">
        <SettingsRow label="Sprache" value="Deutsch" />
        <SettingsRow label="Dark Mode" value="Aktiv" />
        <SettingsRow
          label="Benachrichtigungen"
          onPress={() => showComingSoon('Benachrichtigungen')}
        />
      </SettingsSection>

      <SettingsSection title="Datenschutz">
        <SettingsRow
          label="Datenschutzerklärung"
          onPress={() => showComingSoon('Datenschutzerklärung')}
        />
        <SettingsRow label="Datenexport" onPress={() => showComingSoon('Datenexport')} />
        <SettingsRow label="Berechtigungen" onPress={() => navigation.navigate('Permissions')} />
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsRow label="Hilfe" onPress={() => showComingSoon('Hilfe')} />
        <SettingsRow label="Feedback senden" onPress={() => showComingSoon('Feedback senden')} />
        <SettingsRow label="App bewerten" onPress={() => showComingSoon('App bewerten')} />
      </SettingsSection>

      <SettingsSection title="Rechtliches">
        <SettingsRow label="Impressum" onPress={() => showComingSoon('Impressum')} />
        <SettingsRow label="Datenschutz" onPress={() => showComingSoon('Datenschutz')} />
        <SettingsRow
          label="Nutzungsbedingungen"
          onPress={() => showComingSoon('Nutzungsbedingungen')}
        />
      </SettingsSection>
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
    paddingBottom: theme.spacing.xl,
  },
});
