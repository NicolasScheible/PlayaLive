import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { DrawerContent } from './DrawerContent';

const mockUseProfile = jest.fn();

jest.mock('../features/profile/hooks/useProfile', () => ({
  useProfile: () => mockUseProfile(),
}));

jest.mock('../store/authStore', () => ({
  useAuthStore: (selector: (state: { session: { user: { email: string } } | null }) => unknown) =>
    selector({ session: { user: { email: 'lisa@example.com' } } }),
}));

const Drawer = createDrawerNavigator();

// `DrawerContent` erwartet die von der Drawer-Bibliothek übergebenen `DrawerContentComponentProps` —
// gerendert über einen minimalen echten `Drawer.Navigator`, statt die Props selbst nachzubauen.
function renderDrawerContent() {
  return render(
    <NavigationContainer>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home">{() => <Text>Screen-Inhalt</Text>}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>,
  );
}

describe('DrawerContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('zeigt Benutzername und E-Mail aus dem bestehenden Auth-/Profile-State', () => {
    mockUseProfile.mockReturnValue({
      profile: { display_name: 'Lisa', avatar_url: null },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderDrawerContent();

    expect(screen.getByText('Lisa')).toBeTruthy();
    expect(screen.getByText('lisa@example.com')).toBeTruthy();
  });

  it('zeigt einen Platzhalter-Avatar mit Initiale, wenn kein avatar_url gesetzt ist', () => {
    mockUseProfile.mockReturnValue({
      profile: { display_name: 'Lisa', avatar_url: null },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderDrawerContent();

    expect(screen.getByText('L')).toBeTruthy();
  });

  it('zeigt „Ohne Namen", solange kein Profil geladen ist', () => {
    mockUseProfile.mockReturnValue({ profile: null, isLoading: true, isError: false, error: null });

    renderDrawerContent();

    expect(screen.getByText('Ohne Namen')).toBeTruthy();
  });
});
