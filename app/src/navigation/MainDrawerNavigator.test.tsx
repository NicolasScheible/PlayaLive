import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { MainDrawerNavigator } from './MainDrawerNavigator';

// Die fünf Feature-Screens werden durch einfache Platzhalter ersetzt — sie haben jeweils eigene,
// umfangreiche Tests (Hooks/Daten), hier geht es ausschließlich um die Drawer-/Menü-Navigation selbst
// (Auftrag: „Es geht ausschließlich um die Navigation und das Menü"). `require()` innerhalb der
// Mock-Factories ist hier notwendig, da jest.mock-Factories von babel-plugin-jest-hoist vor alle
// Imports gehoben werden (kein Zugriff auf außerhalb der Factory importierte Module).
jest.mock('../features/home/screens/HomeScreen', () => ({
  HomeScreen: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return <Text>Home-Screen-Inhalt</Text>;
  },
}));

jest.mock('../features/map/screens/MapScreen', () => ({
  MapScreen: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return <Text>Map-Screen-Inhalt</Text>;
  },
}));

jest.mock('../features/favorites/screens/FavoritesScreen', () => ({
  FavoritesScreen: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return <Text>Favoriten-Screen-Inhalt</Text>;
  },
}));

jest.mock('../features/profile/screens/ProfileScreen', () => ({
  ProfileScreen: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return <Text>Profil-Screen-Inhalt</Text>;
  },
}));

jest.mock('../features/settings/screens/SettingsScreen', () => ({
  SettingsScreen: () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Text } = require('react-native');
    return <Text>Settings-Screen-Inhalt</Text>;
  },
}));

jest.mock('../features/profile/hooks/useProfile', () => ({
  useProfile: () => ({
    profile: { display_name: 'Lisa', avatar_url: null },
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

jest.mock('../store/authStore', () => ({
  useAuthStore: (selector: (state: { session: { user: { email: string } } }) => unknown) =>
    selector({ session: { user: { email: 'lisa@example.com' } } }),
}));

function renderDrawer() {
  return render(
    <NavigationContainer>
      <MainDrawerNavigator />
    </NavigationContainer>,
  );
}

describe('MainDrawerNavigator', () => {
  it('zeigt Home als Startscreen', () => {
    renderDrawer();

    expect(screen.getByText('Home-Screen-Inhalt')).toBeTruthy();
  });

  it('zeigt alle fünf im Auftrag genannten Einträge — Community Report nicht', () => {
    renderDrawer();

    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Live Map')).toBeTruthy();
    expect(screen.getByText('Favoriten')).toBeTruthy();
    expect(screen.getByText('Profil')).toBeTruthy();
    expect(screen.getByText('Einstellungen')).toBeTruthy();
    expect(screen.queryByText('Melden')).toBeNull();
    expect(screen.queryByText('Community Report')).toBeNull();
  });

  it('hebt den aktiven Menüpunkt hervor (Home ist initial aktiv)', () => {
    renderDrawer();

    expect(screen.getByRole('button', { name: 'Home', selected: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Live Map', selected: false })).toBeTruthy();
  });

  it('navigiert beim Tippen auf „Live Map" zum Map-Screen und markiert ihn als aktiv', async () => {
    renderDrawer();

    fireEvent.press(screen.getByText('Live Map'));

    await waitFor(() => expect(screen.getByText('Map-Screen-Inhalt')).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Live Map', selected: true })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Home', selected: false })).toBeTruthy();
  });

  it('navigiert beim Tippen auf „Favoriten" zum Favoriten-Screen', async () => {
    renderDrawer();

    fireEvent.press(screen.getByText('Favoriten'));

    await waitFor(() => expect(screen.getByText('Favoriten-Screen-Inhalt')).toBeTruthy());
  });

  it('navigiert beim Tippen auf „Profil" zum Profil-Screen', async () => {
    renderDrawer();

    fireEvent.press(screen.getByText('Profil'));

    await waitFor(() => expect(screen.getByText('Profil-Screen-Inhalt')).toBeTruthy());
  });

  it('navigiert beim Tippen auf „Einstellungen" zum Settings-Screen', async () => {
    renderDrawer();

    fireEvent.press(screen.getByText('Einstellungen'));

    await waitFor(() => expect(screen.getByText('Settings-Screen-Inhalt')).toBeTruthy());
  });

  it('zeigt den Drawer-Header mit Benutzername und E-Mail aus dem bestehenden Auth-/Profile-State', () => {
    renderDrawer();

    expect(screen.getByText('Lisa')).toBeTruthy();
    expect(screen.getByText('lisa@example.com')).toBeTruthy();
  });
});
