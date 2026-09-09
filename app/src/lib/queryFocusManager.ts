import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';

// TanStack Querys Standardverhalten (`refetchOnWindowFocus: true`, siehe `queryClient.ts`) beruht auf
// Web-Events (`visibilitychange`/`focus`), die es in React Native nicht gibt — ohne diese Verdrahtung
// aktualisieren dauerhaft gemountete Screens (z. B. Home im Drawer) ihre Daten NIE automatisch, wenn
// die App aus dem Hintergrund zurückkehrt (Auftrag „Offline-/Netzwerkverhalten"). Empfohlenes Muster
// aus der TanStack-Query-Dokumentation für React Native — ausschließlich mit dem bereits vorhandenen
// `react-native`-Kern (`AppState`), keine neue Abhängigkeit. Reconnect-Erkennung (`onlineManager`)
// bräuchte zusätzlich `@react-native-community/netinfo`, das nicht installiert ist — hier bewusst nicht
// ergänzt (CLAUDE.md „keine neue Abhängigkeit ohne expliziten Auftrag"), siehe Abschlussbericht.
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

export function useQueryFocusManager() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);
}
