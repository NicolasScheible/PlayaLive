import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from './lib/queryClient';
import { RootNavigator } from './navigation/RootNavigator';

// Einstiegspunkt der App (siehe docs/Architecture.md Kapitel 5). Verdrahtet ausschließlich die
// grundlegenden Provider (Navigation, Server State) — Auth-Gate, Bottom Tabs und Drawer folgen mit den
// jeweiligen Features.
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
          <StatusBar style="light" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
