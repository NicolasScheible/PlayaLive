import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from './lib/queryClient';
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
// Hauptnavigation läuft über den RootNavigator (docs/ADR/002-Authentication.md).
export default function App() {
  return (
    <AppProviders>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </AppProviders>
  );
}
