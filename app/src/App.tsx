import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthDeepLink } from './features/auth/hooks/useAuthDeepLink';
import { useForegroundNotifications } from './features/notifications/hooks/useForegroundNotifications';
import { useNotificationListeners } from './features/notifications/hooks/useNotificationListeners';
import { queryClient } from './lib/queryClient';
import { navigationRef } from './navigation/navigationRef';
import { RootNavigator } from './navigation/RootNavigator';

// Globaler AppProvider (siehe docs/Architecture.md Kapitel 5, 8, 10): bündelt die app-weiten,
// feature-unabhängigen Provider (Gesture Handler, Safe Area, TanStack Query als Server-State-Schicht,
// siehe docs/ADR/001-State-Management.md). Auth- und Navigationszustand liegen bewusst außerhalb, da sie
// über den RootNavigator/authStore verwaltet werden.
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Einstiegspunkt der App (siehe docs/Architecture.md Kapitel 5): Auth-Gate (Login-Pflicht) vor der
// Hauptnavigation läuft über den RootNavigator (docs/ADR/002-Authentication.md). `navigationRef` am
// `NavigationContainer` sowie die beiden Notification-Listener-Hooks sind app-weite Infrastruktur für
// das Push-Notification-Feature (docs/ADR/007-Notifications.md) — Registrierung/Berechtigung selbst
// laufen weiterhin über den nutzerinitiierten Einstieg im Settings-Screen, nicht automatisch beim Start.
// useAuthDeepLink ist analog app-weite Infrastruktur für den E-Mail-Bestätigungslink (siehe
// docs/ADR/002-Authentication.md „E-Mail-Verifizierung").
export default function App() {
  useNotificationListeners();
  useForegroundNotifications();
  useAuthDeepLink();

  return (
    <AppProviders>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </AppProviders>
  );
}
