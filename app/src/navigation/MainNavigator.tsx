import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArtistDetailScreen } from '../features/artists/screens/ArtistDetailScreen';
import { EventDetailScreen } from '../features/events/screens/EventDetailScreen';
import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { LocationDetailScreen } from '../features/locations/screens/LocationDetailScreen';
import { MapScreen } from '../features/map/screens/MapScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { CommunityReportScreen } from '../features/reports/screens/CommunityReportScreen';
import { ChangePasswordScreen } from '../features/settings/screens/ChangePasswordScreen';
import { PermissionsScreen } from '../features/settings/screens/PermissionsScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';

import type { MainStackParamList } from './types';

// Haupt-App nach erfolgreichem Login. Zeigt Home Dashboard, Live-Karte, die vollständigen
// Location-/Event-/Artist-Detail-Screens sowie die Favoriten-/Profil-/Community-Report-/Settings-
// Screens (siehe docs/PRD.md Kapitel 10) über einen einfachen Stack — die endgültige Struktur
// (5-Tab-Bottom-Navigation mit zentralem Community-Report-Schnellzugriff, Hamburger-Drawer, siehe
// docs/PRD.md Kapitel 11, docs/Architecture.md Kapitel 7) wird erst mit den übrigen Tab-/Menü-Screens
// umgesetzt. Der bisherige Demo-Logout-Platzhalter entfällt damit — „Abmelden" ist jetzt Teil des
// `ProfileScreen` (docs/PRD.md Kapitel 10), nicht mehr des Home Dashboards.
const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoriten' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Einstellungen' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Passwort ändern' }}
      />
      <Stack.Screen
        name="Permissions"
        component={PermissionsScreen}
        options={{ title: 'Berechtigungen' }}
      />
      <Stack.Screen
        name="CommunityReport"
        component={CommunityReportScreen}
        options={{ title: 'Melden' }}
      />
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
