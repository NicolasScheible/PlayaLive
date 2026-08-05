import type { RemoteMessage } from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Alert } from 'react-native';

import { navigationRef } from '../../../navigation/navigationRef';
import { NotificationService } from '../../../services/NotificationService';

// Auftrag Punkt 4 „Foreground Notifications: Anzeige innerhalb der App. Bestehende Architektur
// verwenden." FCM zeigt Nachrichten im Vordergrund nicht automatisch als System-Notification an. Es
// existiert keine Toast-/Banner-Komponente im Designsystem — Anzeige daher über das native `Alert`,
// bereits als Muster für kurze, blockierende Hinweise etabliert (siehe
// `features/settings/screens/SettingsScreen.tsx` „Demnächst verfügbar"), keine neue UI-Komponente.
function showForegroundNotification(message: RemoteMessage) {
  const title = message.notification?.title ?? 'Neue Benachrichtigung';
  const body = message.notification?.body;
  const target = NotificationService.parseNotificationTarget(message);

  const buttons = target
    ? [
        { text: 'Verwerfen', style: 'cancel' as const },
        {
          text: 'Anzeigen',
          onPress: () => {
            if (!navigationRef.isReady()) {
              return;
            }

            switch (target.type) {
              case 'location':
                navigationRef.navigate('LocationDetail', { locationId: target.id });
                break;
              case 'artist':
                navigationRef.navigate('ArtistDetail', { artistId: target.id });
                break;
              case 'event':
                navigationRef.navigate('EventDetail', { eventId: target.id });
                break;
            }
          },
        },
      ]
    : undefined;

  Alert.alert(title, body, buttons);
}

export function useForegroundNotifications() {
  useEffect(() => {
    return NotificationService.onForegroundMessage(showForegroundNotification);
  }, []);
}
