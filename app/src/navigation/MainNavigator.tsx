import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { useAuth } from '../features/auth/hooks/useAuth';
import { theme } from '../theme/theme';

// Platzhalter für die Haupt-App nach erfolgreichem Login. Die endgültige Struktur (5-Tab-Bottom-
// Navigation mit Community-Report-Schnellzugriff, Hamburger-Drawer — siehe docs/PRD.md Kapitel 11,
// docs/Architecture.md Kapitel 7) wird erst mit den jeweiligen Feature-Screens umgesetzt. Der
// Logout-Button demonstriert den vollständigen Auth-Loop (Login → Haupt-App → Logout → Login) und
// entfällt, sobald das Profile-Feature den echten Ort für „Abmelden" liefert.
function MainPlaceholderScreen() {
  const { logout, loading } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>PlayaLive</Text>
      <View style={styles.logoutButton}>
        <Button label="Abmelden" variant="secondary" onPress={logout} loading={loading} />
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainPlaceholderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.base,
    gap: theme.spacing.xl,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: 24,
    fontWeight: '600',
  },
  logoutButton: {
    minWidth: 160,
  },
});
