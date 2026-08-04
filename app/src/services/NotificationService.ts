import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { Notification } from '../types/entities';

import { AuthService } from './AuthService';

// Service Layer für Notifications (siehe docs/Architecture.md Kapitel 8, docs/API.md Kapitel 10). Ohne
// Repository-Schicht (docs/Architecture.md Kapitel 9). Notifications entstehen ausschließlich
// serverseitig (supabase/migrations/20260804122740_notifications.sql: keine INSERT-Policy für
// `authenticated`), daher gibt es hier bewusst keine `createNotification`-Methode.
//
// 🔴 Benachrichtigungseinstellungen und Push-Token-Registrierung (docs/API.md Kapitel 10) sind nicht
// Teil dieses Service, da docs/Database.md keine entsprechende Tabelle dokumentiert (siehe
// Migrationskommentar in 20260804122740_notifications.sql) — zur Bestätigung durch den Product Owner
// vorgelegt, bevor eine solche Struktur ergänzt wird.
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
};
