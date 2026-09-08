import * as Linking from 'expo-linking';
import { useEffect } from 'react';

import { AuthService } from '../../../services/AuthService';

// Verarbeitet eingehende Supabase-Auth-Links (E-Mail-Bestätigung), einmalig app-weit gemountet
// (siehe App.tsx, analog zu useNotificationListeners.ts). Deckt beide Fälle ab: App wird über den
// Link erst gestartet (Linking.getInitialURL) und App ist beim Antippen des Links bereits offen
// (Linking.addEventListener). Baut bewusst keinen eigenen Auth-Zustand auf — AuthService.
// handleAuthCallbackUrl() übergibt eine erkannte Session an das Supabase-SDK, der bestehende
// onAuthStateChange-Listener im authStore übernimmt sie wie jeden anderen Login.
function handleUrl(url: string | null) {
  if (!url) {
    return;
  }

  AuthService.handleAuthCallbackUrl(url).catch((error) => {
    // Ursprüngliches Bug-Symptom war ein Logcat ohne jeden brauchbaren Hinweis auf einen
    // fehlgeschlagenen Bestätigungslink — dieser Log-Punkt macht den Fehler sichtbar.
    console.error(
      '[useAuthDeepLink] E-Mail-Bestätigungslink konnte nicht verarbeitet werden:',
      error,
    );
  });
}

export function useAuthDeepLink() {
  useEffect(() => {
    Linking.getInitialURL()
      .then(handleUrl)
      .catch((error) => {
        console.error('[useAuthDeepLink] getInitialURL() fehlgeschlagen:', error);
      });

    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    return () => {
      subscription.remove();
    };
  }, []);
}
