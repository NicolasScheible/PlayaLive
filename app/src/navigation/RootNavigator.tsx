import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

// Platzhalter für die Root-Navigation. Die endgültige Struktur (Login-Gate, Bottom Tabs,
// Community-Report-Schnellzugriff, Drawer-Menü) ist in docs/PRD.md Kapitel 11 und
// docs/Architecture.md Kapitel 7 entschieden, wird aber erst mit den jeweiligen Feature-Screens
// umgesetzt — dieses technische Setup enthält bewusst noch keine Business-Logik.
function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>PlayaLive</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Placeholder"
        component={PlaceholderScreen}
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
    backgroundColor: colors.background.base,
  },
  text: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '600',
  },
});
