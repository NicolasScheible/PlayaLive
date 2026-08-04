import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

// Platzhalter für den Login-/Registrierungs-Flow (Apple Sign-In, Google Sign-In, E-Mail & Passwort —
// siehe docs/PRD.md Kapitel 12, docs/ADR/002-Authentication.md). Login ist ab v1.0 verpflichtend, es
// gibt keinen Gastmodus — dieser Navigator wird gerendert, solange keine Session besteht. Die
// eigentlichen Screens folgen mit dem Auth-Feature.
function LoginPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginPlaceholderScreen}
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
