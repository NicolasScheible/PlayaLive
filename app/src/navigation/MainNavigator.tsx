import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ArtistDetailScreen } from '../features/artists/screens/ArtistDetailScreen';
import { EventDetailScreen } from '../features/events/screens/EventDetailScreen';
import { LocationDetailScreen } from '../features/locations/screens/LocationDetailScreen';
import { CommunityReportScreen } from '../features/reports/screens/CommunityReportScreen';
import { ReviewFormScreen } from '../features/reviews/screens/ReviewFormScreen';
import { ChangePasswordScreen } from '../features/settings/screens/ChangePasswordScreen';
import { PermissionsScreen } from '../features/settings/screens/PermissionsScreen';

import { MainDrawerNavigator } from './MainDrawerNavigator';
import type { MainStackParamList } from './types';

// Haupt-App nach erfolgreichem Login. „Main" rendert seit der finalen Drawer-/Menü-Navigation den
// `MainDrawerNavigator` (Home/Live Map/Favoriten/Profil/Einstellungen, siehe docs/PRD.md Kapitel 11
// „Hamburger-Menü") statt direkt `HomeScreen` — Header bleibt hier ausgeblendet, der Drawer bzw. die
// einzelnen Screens stellen ihren eigenen Header. Detail-Screens (Location/Event/Artist), Community
// Report (bewusst NICHT im Drawer, nur programmatisch erreichbar) sowie die Settings-Unterseiten
// (ChangePassword/Permissions) bleiben auf dieser Stack-Ebene — aus jedem verschachtelten
// Drawer-Screen heraus erreichbar, da React Navigation `navigate(...)` zu einem im aktuellen
// Navigator nicht vorhandenen Routennamen automatisch beim übergeordneten Navigator auflöst. Der
// bisherige Demo-Logout-Platzhalter entfällt damit — „Abmelden" ist Teil des `ProfileScreen`
// (docs/PRD.md Kapitel 10), nicht zusätzlich im Drawer (Auftrag Punkt 6).
const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainDrawerNavigator} options={{ headerShown: false }} />
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
      <Stack.Screen
        name="ReviewForm"
        component={ReviewFormScreen}
        options={({ route }) => ({
          title: route.params.review ? 'Bewertung bearbeiten' : 'Bewertung abgeben',
        })}
      />
    </Stack.Navigator>
  );
}
