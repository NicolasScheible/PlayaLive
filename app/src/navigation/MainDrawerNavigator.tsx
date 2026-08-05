import { createDrawerNavigator } from '@react-navigation/drawer';

import { FavoritesScreen } from '../features/favorites/screens/FavoritesScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { MapScreen } from '../features/map/screens/MapScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { theme } from '../theme/theme';

import { DrawerContent } from './DrawerContent';
import type { MainDrawerParamList } from './types';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

// Finale Drawer-/Menü-Navigation (docs/Architecture.md Kapitel 7: „Hamburger-Menü: Umsetzung über den
// offiziellen React-Navigation-Drawer (kein Eigenbau)", docs/PRD.md Kapitel 11). Enthält ausschließlich
// die im Auftrag genannten fünf Einträge; Community Report ist bewusst NICHT Teil des Drawers (bleibt
// Stack-Route in `MainNavigator.tsx`). Aktiver Eintrag wird von der Bibliothek selbst über
// `drawerActiveTintColor`/`drawerActiveBackgroundColor` hervorgehoben — keine eigene Aktiv-Erkennung/
// Business-Logik hier. Alle fünf Screens sind unverändert die bestehenden Feature-Screens; `Home` und
// `Map` behalten ihren eigenen, bereits bestehenden Header (`headerShown: false`), die übrigen nutzen
// den von der Drawer-Bibliothek automatisch bereitgestellten Header mit Hamburger-Icon (kein
// Zurück-Button, da diese Screens jetzt Drawer-Wurzeln statt gepushte Stack-Screens sind).
export function MainDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background.base },
        headerTintColor: theme.colors.text.primary,
        headerShadowVisible: false,
        drawerActiveTintColor: theme.colors.brand.primary,
        drawerActiveBackgroundColor: theme.colors.overlay.scrim,
        drawerInactiveTintColor: theme.colors.text.secondary,
        drawerStyle: { backgroundColor: theme.colors.background.base },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, drawerLabel: 'Home' }}
      />
      <Drawer.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false, drawerLabel: 'Live Map' }}
      />
      <Drawer.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoriten', drawerLabel: 'Favoriten' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil', drawerLabel: 'Profil' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Einstellungen', drawerLabel: 'Einstellungen' }}
      />
    </Drawer.Navigator>
  );
}
