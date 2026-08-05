import {
  AuthorizationStatus,
  getInitialNotification as getInitialFirebaseNotification,
  getMessaging,
  getToken,
  hasPermission,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission as requestFirebasePermission,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import type { RemoteMessage } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { FavoriteTargetType, Notification, Profile } from '../types/entities';

import { AuthService } from './AuthService';

// Service Layer für Notifications (siehe docs/Architecture.md Kapitel 8, docs/API.md Kapitel 10,
// docs/ADR/007-Notifications.md). Ohne Repository-Schicht (docs/Architecture.md Kapitel 9).
// Notifications entstehen ausschließlich serverseitig (supabase/migrations/20260804122740_notifications.sql:
// keine INSERT-Policy für `authenticated`), daher gibt es hier bewusst keine `createNotification`-Methode.
//
// Einzige Stelle im Code mit Zugriff auf `@react-native-firebase/messaging` (ADR-007: „kein direkter
// Zugriff aus Screens/Komponenten auf Firebase oder die notifications-Tabelle"). Push-Token und
// Benachrichtigungs-Einstellung werden auf `profiles.push_token`/`profiles.push_notifications_enabled`
// verwaltet (siehe supabase/migrations/20260805090000_notifications_push_settings.sql — ergänzt nach
// Rückfrage beim Product Owner die in 20260804122740_notifications.sql bewusst zurückgestellte
// Datenstruktur).
async function requireUserId(): Promise<string> {
  const { session } = await AuthService.getSession();

  if (!session) {
    const error: AppError = {
      code: 'AUTH_SESSION_MISSING',
      messageKey: 'errors.auth.AUTH_SESSION_MISSING',
      message: 'Du musst angemeldet sein, um diese Aktion auszuführen.',
      technicalMessage: 'No active session',
    };
    throw error;
  }

  return session.user.id;
}

export type PushPermissionStatus = 'undetermined' | 'granted' | 'denied';

function toPushPermissionStatus(status: number): PushPermissionStatus {
  switch (status) {
    case AuthorizationStatus.AUTHORIZED:
    case AuthorizationStatus.PROVISIONAL:
    case AuthorizationStatus.EPHEMERAL:
      return 'granted';
    case AuthorizationStatus.DENIED:
      return 'denied';
    default:
      return 'undetermined';
  }
}

export type NotificationTarget = { type: FavoriteTargetType; id: string };

// `related_type`/`related_id` verwenden denselben Wertebereich wie `favorites.target_type`
// (supabase/migrations/20260804122740_notifications.sql), daher Wiederverwendung von
// `FavoriteTargetType` statt eines eigenen Typs.
function parseNotificationTarget(message: RemoteMessage): NotificationTarget | null {
  const relatedType = message.data?.related_type;
  const relatedId = message.data?.related_id;

  if (
    (relatedType !== 'location' && relatedType !== 'artist' && relatedType !== 'event') ||
    typeof relatedId !== 'string'
  ) {
    return null;
  }

  return { type: relatedType, id: relatedId };
}

export const NotificationService = {
  // docs/API.md Kapitel 10 „Eigene Benachrichtigungen abrufen".
  async getNotifications(): Promise<Notification[]> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  // docs/API.md Kapitel 10 „Benachrichtigung als gelesen markieren" — nur `is_read` ist änderbar
  // (serverseitig über den Trigger `restrict_notification_update_to_is_read()` erzwungen).
  async markAsRead(notificationId: string): Promise<Notification> {
    await requireUserId();

    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select('*')
      .single();

    if (error) {
      throw mapDatabaseError(error, {
        notFound: {
          code: 'NOTIFICATION_NOT_FOUND',
          message: 'Diese Benachrichtigung wurde nicht gefunden.',
        },
      });
    }

    return data;
  },

  // Aktuellen Berechtigungsstatus lesen, OHNE eine Anfrage auszulösen (analog zu
  // `useUserLocation`/`usePhotoLibraryPermission` — „Berechtigung wird erst angefragt, wenn eine
  // Funktion sie tatsächlich benötigt", docs/Architecture.md Kapitel 17). Android liefert über
  // `PermissionsAndroid.check()` nur ein Boolean (kein Tri-State) — „nicht erteilt" wird daher als
  // `undetermined` behandelt, die aufrufende UI zeigt dafür denselben „Erlauben"-Einstieg wie für einen
  // wirklich noch nicht angefragten Status (Android fragt nach einer bereits erfolgten Ablehnung ohnehin
  // kein zweites Mal nach, siehe `requestPushPermission`).
  async getPushPermissionStatus(): Promise<PushPermissionStatus> {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      return granted ? 'granted' : 'undetermined';
    }

    const status = await hasPermission(getMessaging());

    return toPushPermissionStatus(status);
  },

  // Fragt die Push-Berechtigung an (nur aufzurufen, wenn `getPushPermissionStatus()` zuvor
  // `undetermined` ergeben hat — verhindert mehrfache Permission-Dialoge, siehe Aufrufer in
  // `features/settings/hooks/useNotificationSettings.ts`).
  async requestPushPermission(): Promise<PushPermissionStatus> {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      return result === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied';
    }

    const status = await requestFirebasePermission(getMessaging());

    return toPushPermissionStatus(status);
  },

  getPushToken(): Promise<string> {
    return getToken(getMessaging());
  },

  // Push-Token-Lebenszyklus (docs/ADR/007-Notifications.md „Konsequenzen": „vom NotificationService zu
  // verwalten"). `registerPushToken`/`removePushToken` schreiben auf `profiles.push_token` — die
  // bestehende `profiles_update_own_or_admin`-Policy deckt das bereits ab.
  async registerPushToken(token: string): Promise<void> {
    const userId = await requireUserId();

    const { error } = await supabase
      .from('profiles')
      .update({ push_token: token })
      .eq('id', userId);

    if (error) {
      throw mapDatabaseError(error);
    }
  },

  // Wird u. a. beim Logout aufgerufen (Token soll nicht mit dem vorherigen Nutzer verknüpft bleiben).
  async removePushToken(): Promise<void> {
    const userId = await requireUserId();

    const { error } = await supabase.from('profiles').update({ push_token: null }).eq('id', userId);

    if (error) {
      throw mapDatabaseError(error);
    }
  },

  // docs/API.md Kapitel 10 „Benachrichtigungseinstellungen abrufen/aktualisieren" — Lesen erfolgt über
  // den bestehenden `AuthService.getProfile()`/`['home', 'profile']`-Query-Key (Auftrag Punkt 8: keine
  // unnötigen Requests, bestehende Query Keys verwenden), da `push_notifications_enabled` Teil der
  // ohnehin geladenen `profiles`-Zeile ist.
  async updateNotificationSettings(pushNotificationsEnabled: boolean): Promise<Profile> {
    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('profiles')
      .update({ push_notifications_enabled: pushNotificationsEnabled })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  // Foreground Notifications (Auftrag Punkt 4): FCM zeigt Nachrichten im Vordergrund NICHT automatisch
  // als System-Notification an — Anzeige „innerhalb der App" übernimmt der aufrufende Hook
  // (`features/notifications/hooks/useForegroundNotifications.ts`).
  onForegroundMessage(listener: (message: RemoteMessage) => void): () => void {
    return onMessage(getMessaging(), listener);
  },

  // Wird aufgerufen, wenn der Nutzer eine Notification antippt und die App dadurch aus dem Hintergrund
  // in den Vordergrund wechselt (Auftrag Punkt 5/6).
  onNotificationOpened(listener: (message: RemoteMessage) => void): () => void {
    return onNotificationOpenedApp(getMessaging(), listener);
  },

  // Wird aufgerufen, wenn die App über das Antippen einer Notification aus dem beendeten Zustand
  // gestartet wurde (Auftrag Punkt 5/6) — `null`, wenn die App nicht über eine Notification gestartet
  // wurde.
  getInitialNotification(): Promise<RemoteMessage | null> {
    return getInitialFirebaseNotification(getMessaging());
  },

  // ADR-007 „Konsequenzen": Token-Aktualisierung bei Token-Wechsel gehört zum vom NotificationService
  // verwalteten Lebenszyklus.
  onPushTokenRefresh(listener: (token: string) => void): () => void {
    return onTokenRefresh(getMessaging(), listener);
  },

  // Muss außerhalb des React-Lifecycles registriert werden (siehe `index.ts`) — Firebase-Vorgabe für
  // Background-/Quit-State-Handler. Ohne eigene Logik: reine Registrierung, damit Android keine
  // Warnung ausgibt; die eigentliche Verarbeitung (Anzeige/Navigation) übernehmen
  // `onNotificationOpened`/`getInitialNotification` beim Antippen.
  registerBackgroundHandler(): void {
    setBackgroundMessageHandler(getMessaging(), async () => undefined);
  },

  // Bezugsobjekt einer Notification (Location/Artist/Event) auflösen, damit der aufrufende Hook zum
  // passenden, bestehenden Detail-Screen navigieren kann (Auftrag Punkt 6). Reine Auswertung des
  // Nachrichten-Payloads, keine Navigation hier (Service Layer bleibt navigationsunabhängig).
  parseNotificationTarget,
};
