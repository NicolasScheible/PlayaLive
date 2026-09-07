import type { RemoteMessage } from '@react-native-firebase/messaging';
import { useEffect } from 'react';

import { navigationRef } from '../../../navigation/navigationRef';
import { NotificationService } from '../../../services/NotificationService';

// Auftrag Punkt 5 „Background Notifications: Navigation über Deep Links vorbereiten" und Punkt 6
// „Notification Handling: Event/Location/Artist, nur bestehende Detail-Screens öffnen". Wird einmalig
// app-weit gemountet (siehe App.tsx) — keine neue Navigation, sondern Wiederverwendung der bereits
// bestehenden `LocationDetail`/`EventDetail`/`ArtistDetail`-Stack-Routen über den bestehenden
// `navigationRef`.
function openNotificationTarget(message: RemoteMessage) {
  const target = NotificationService.parseNotificationTarget(message);

  if (!target || !navigationRef.isReady()) {
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
}

export function useNotificationListeners() {
  useEffect(() => {
    NotificationService.getInitialNotification()
      .then((message) => {
        if (message) {
          openNotificationTarget(message);
        }
      })
      .catch((error) => {
        // Firebase Messaging kann hier ablehnen, wenn das native Modul nicht korrekt initialisiert
        // ist (siehe docs/ADR/007-Notifications.md) — ohne diesen Catch würde React Native das als
        // unhandled promise rejection melden, statt dass der App-Start davon unbeeinflusst bleibt.
        console.error('[useNotificationListeners] getInitialNotification() fehlgeschlagen:', error);
      });

    const unsubscribeOpened = NotificationService.onNotificationOpened(openNotificationTarget);

    // ADR-007 „Konsequenzen": Token-Aktualisierung bei Token-Wechsel gehört zum vom NotificationService
    // verwalteten Lebenszyklus. Ohne aktive Session (z. B. vor dem Login) schlägt die Registrierung
    // erwartungsgemäß fehl — wird hier bewusst verworfen, kein Fehlerzustand für die UI.
    const unsubscribeTokenRefresh = NotificationService.onPushTokenRefresh((token) => {
      NotificationService.registerPushToken(token).catch(() => undefined);
    });

    return () => {
      unsubscribeOpened();
      unsubscribeTokenRefresh();
    };
  }, []);
}
