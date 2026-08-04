import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../features/home/screens/HomeScreen';

// Haupt-App nach erfolgreichem Login. Zeigt aktuell ausschließlich das Home Dashboard (siehe
// docs/PRD.md Kapitel 10) über einen einfachen Stack — die endgültige Struktur (5-Tab-Bottom-
// Navigation mit Community-Report-Schnellzugriff, Hamburger-Drawer, siehe docs/PRD.md Kapitel 11,
// docs/Architecture.md Kapitel 7) wird erst mit den übrigen Bottom-Tab-Screens (Map, Events, Profil)
// umgesetzt, da diese nicht Teil dieses Arbeitsschritts sind. Der bisherige Demo-Logout-Platzhalter
// entfällt damit — „Abmelden" gehört fachlich zum (noch nicht umgesetzten) Profile-Screen
// (docs/PRD.md Kapitel 10), nicht zum Home Dashboard.
const Stack = createNativeStackNavigator();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
