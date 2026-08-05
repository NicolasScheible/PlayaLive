import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArtistDetailScreen } from '../features/artists/screens/ArtistDetailScreen';
import { EventDetailScreen } from '../features/events/screens/EventDetailScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { LocationDetailScreen } from '../features/locations/screens/LocationDetailScreen';
import { MapScreen } from '../features/map/screens/MapScreen';

import type { MainStackParamList } from './types';

// Haupt-App nach erfolgreichem Login. Zeigt Home Dashboard, Live-Karte, die vollständigen
// Location-/Event-Detail-Screens und den Artist-Detail-Platzhalter (siehe docs/PRD.md Kapitel 10) über
// einen einfachen Stack — die endgültige Struktur (5-Tab-Bottom-Navigation mit
// Community-Report-Schnellzugriff, Hamburger-Drawer, siehe docs/PRD.md Kapitel 11,
// docs/Architecture.md Kapitel 7) wird erst mit den übrigen Tab-Screens (Events, Profil) umgesetzt, da
// diese nicht Teil des Event-Detail-Auftrags sind. Der bisherige Demo-Logout-Platzhalter entfällt
// damit — „Abmelden" gehört fachlich zum (noch nicht umgesetzten) Profile-Screen (docs/PRD.md
// Kapitel 10), nicht zum Home Dashboard.
const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="LocationDetail"
        component={LocationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ArtistDetail"
        component={ArtistDetailScreen}
        options={{ title: 'Künstler' }}
      />
    </Stack.Navigator>
  );
}
