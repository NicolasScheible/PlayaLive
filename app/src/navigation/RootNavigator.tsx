import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthStore } from '../store/authStore';
import { theme } from '../theme/theme';

import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

// Routing zwischen Login und Haupt-App (siehe docs/Architecture.md Kapitel 7, docs/ADR/002-Authentication.md).
// Login ist ab v1.0 verpflichtend, es gibt keinen Gastmodus — ohne Session wird ausschließlich der
// AuthNavigator gerendert, nie die Haupt-App.
function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.brand.primary} />
    </View>
  );
}

export function RootNavigator() {
  const session = useAuthStore((state) => state.session);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return session ? <MainNavigator /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.base,
  },
});
