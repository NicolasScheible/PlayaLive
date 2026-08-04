import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Platzhalter für die Haupt-App nach erfolgreichem Login. Die endgültige Struktur (5-Tab-Bottom-
// Navigation mit Community-Report-Schnellzugriff, Hamburger-Drawer — siehe docs/PRD.md Kapitel 11,
// docs/Architecture.md Kapitel 7) wird erst mit den jeweiligen Feature-Screens umgesetzt.
function MainPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PlayaLive</Text>
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
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: 24,
    fontWeight: '600',
  },
});
