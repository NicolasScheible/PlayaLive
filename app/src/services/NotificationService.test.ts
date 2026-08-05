import { AuthorizationStatus } from '@react-native-firebase/messaging';
import type { RemoteMessage } from '@react-native-firebase/messaging';

import { NotificationService } from './NotificationService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();
const mockGetSession = jest.fn();
const mockGetMessaging = jest.fn((..._args: unknown[]) => 'messaging-instance');
const mockGetToken = jest.fn();
const mockHasPermission = jest.fn();
const mockRequestPermission = jest.fn();
const mockOnMessage = jest.fn();
const mockOnNotificationOpenedApp = jest.fn();
const mockOnTokenRefresh = jest.fn();
const mockGetInitialNotification = jest.fn();
const mockSetBackgroundMessageHandler = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

jest.mock('./AuthService', () => ({
  AuthService: { getSession: (...args: unknown[]) => mockGetSession(...args) },
}));

// Kein `jest.requireActual` für dieses Modul: das echte Paket lädt beim Import bereits ein natives
// Firebase-Modul (`NativeRNFBTurboApp`), das im Jest-Environment nicht registriert ist. Die
// `AuthorizationStatus`-Werte sind reine Konstanten (siehe node_modules/@react-native-firebase/
// messaging/dist/typescript/lib/statics.d.ts) und werden hier deshalb hartkodiert nachgebildet.
jest.mock('@react-native-firebase/messaging', () => {
  return {
    AuthorizationStatus: {
      NOT_DETERMINED: -1,
      DENIED: 0,
      AUTHORIZED: 1,
      PROVISIONAL: 2,
      EPHEMERAL: 3,
    },
    getMessaging: (...args: unknown[]) => mockGetMessaging(...args),
    getToken: (...args: unknown[]) => mockGetToken(...args),
    hasPermission: (...args: unknown[]) => mockHasPermission(...args),
    requestPermission: (...args: unknown[]) => mockRequestPermission(...args),
    onMessage: (...args: unknown[]) => mockOnMessage(...args),
    onNotificationOpenedApp: (...args: unknown[]) => mockOnNotificationOpenedApp(...args),
    onTokenRefresh: (...args: unknown[]) => mockOnTokenRefresh(...args),
    getInitialNotification: (...args: unknown[]) => mockGetInitialNotification(...args),
    setBackgroundMessageHandler: (...args: unknown[]) => mockSetBackgroundMessageHandler(...args),
  };
});

const session = { user: { id: 'user-1' } };

describe('NotificationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('wirft AUTH_SESSION_MISSING ohne aktive Session', async () => {
      mockGetSession.mockResolvedValue({ session: null });

      await expect(NotificationService.getNotifications()).rejects.toMatchObject({
        code: 'AUTH_SESSION_MISSING',
      });
    });

    it('filtert nach dem angemeldeten Nutzer, neueste zuerst', async () => {
      mockGetSession.mockResolvedValue({ session });
      const builder = createQueryBuilderMock({ data: [], error: null });
      mockFrom.mockReturnValue(builder);

      await NotificationService.getNotifications();

      expect(mockFrom).toHaveBeenCalledWith('notifications');
      expect(builder.eq).toHaveBeenCalledWith('user_id', 'user-1');
      expect(builder.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });
  });

  describe('markAsRead', () => {
    it('setzt is_read auf true für die angegebene Notification', async () => {
      mockGetSession.mockResolvedValue({ session });
      const notification = { id: 'notif-1', is_read: true };
      const builder = createQueryBuilderMock({ data: notification, error: null });
      mockFrom.mockReturnValue(builder);

      const result = await NotificationService.markAsRead('notif-1');

      expect(builder.update).toHaveBeenCalledWith({ is_read: true });
      expect(builder.eq).toHaveBeenCalledWith('id', 'notif-1');
      expect(result).toEqual(notification);
    });

    it('übersetzt eine fehlende/fremde Notification als NOTIFICATION_NOT_FOUND', async () => {
      mockGetSession.mockResolvedValue({ session });
      mockFrom.mockReturnValue(
        createQueryBuilderMock({ data: null, error: { code: 'PGRST116', message: 'no rows' } }),
      );

      await expect(NotificationService.markAsRead('notif-1')).rejects.toMatchObject({
        code: 'NOTIFICATION_NOT_FOUND',
      });
    });
  });

  // Platform.OS ist unter jest-expo standardmäßig 'ios' (siehe Kommentar in
  // getPushPermissionStatus/requestPushPermission) — die Android-spezifische
  // PermissionsAndroid-Verzweigung wird weiter unten separat mit gemocktem Platform.OS getestet.
  describe('getPushPermissionStatus (iOS)', () => {
    it('übersetzt AUTHORIZED als granted', async () => {
      mockHasPermission.mockResolvedValue(AuthorizationStatus.AUTHORIZED);

      await expect(NotificationService.getPushPermissionStatus()).resolves.toBe('granted');
    });

    it('übersetzt DENIED als denied', async () => {
      mockHasPermission.mockResolvedValue(AuthorizationStatus.DENIED);

      await expect(NotificationService.getPushPermissionStatus()).resolves.toBe('denied');
    });

    it('übersetzt NOT_DETERMINED als undetermined', async () => {
      mockHasPermission.mockResolvedValue(AuthorizationStatus.NOT_DETERMINED);

      await expect(NotificationService.getPushPermissionStatus()).resolves.toBe('undetermined');
    });
  });

  describe('requestPushPermission (iOS)', () => {
    it('übersetzt das Ergebnis der Firebase-Anfrage', async () => {
      mockRequestPermission.mockResolvedValue(AuthorizationStatus.AUTHORIZED);

      await expect(NotificationService.requestPushPermission()).resolves.toBe('granted');
      expect(mockRequestPermission).toHaveBeenCalledWith('messaging-instance');
    });
  });

  describe('getPushToken', () => {
    it('gibt das Firebase-Token zurück', async () => {
      mockGetToken.mockResolvedValue('fcm-token-123');

      await expect(NotificationService.getPushToken()).resolves.toBe('fcm-token-123');
    });
  });

  describe('registerPushToken', () => {
    it('speichert das Token auf dem eigenen Profil', async () => {
      mockGetSession.mockResolvedValue({ session });
      const builder = createQueryBuilderMock({ data: null, error: null });
      mockFrom.mockReturnValue(builder);

      await NotificationService.registerPushToken('fcm-token-123');

      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(builder.update).toHaveBeenCalledWith({ push_token: 'fcm-token-123' });
      expect(builder.eq).toHaveBeenCalledWith('id', 'user-1');
    });
  });

  describe('removePushToken', () => {
    it('setzt das Token auf null', async () => {
      mockGetSession.mockResolvedValue({ session });
      const builder = createQueryBuilderMock({ data: null, error: null });
      mockFrom.mockReturnValue(builder);

      await NotificationService.removePushToken();

      expect(builder.update).toHaveBeenCalledWith({ push_token: null });
      expect(builder.eq).toHaveBeenCalledWith('id', 'user-1');
    });
  });

  describe('updateNotificationSettings', () => {
    it('aktualisiert push_notifications_enabled auf dem eigenen Profil', async () => {
      mockGetSession.mockResolvedValue({ session });
      const profile = { id: 'user-1', push_notifications_enabled: false };
      const builder = createQueryBuilderMock({ data: profile, error: null });
      mockFrom.mockReturnValue(builder);

      const result = await NotificationService.updateNotificationSettings(false);

      expect(builder.update).toHaveBeenCalledWith({ push_notifications_enabled: false });
      expect(builder.eq).toHaveBeenCalledWith('id', 'user-1');
      expect(result).toEqual(profile);
    });
  });

  describe('onForegroundMessage/onNotificationOpened/onPushTokenRefresh', () => {
    it('reicht den Listener an die jeweilige Firebase-Subscription durch', () => {
      const unsubscribe = jest.fn();
      mockOnMessage.mockReturnValue(unsubscribe);
      mockOnNotificationOpenedApp.mockReturnValue(unsubscribe);
      mockOnTokenRefresh.mockReturnValue(unsubscribe);

      const messageListener = jest.fn();
      const tokenListener = jest.fn();

      expect(NotificationService.onForegroundMessage(messageListener)).toBe(unsubscribe);
      expect(mockOnMessage).toHaveBeenCalledWith('messaging-instance', messageListener);

      expect(NotificationService.onNotificationOpened(messageListener)).toBe(unsubscribe);
      expect(mockOnNotificationOpenedApp).toHaveBeenCalledWith(
        'messaging-instance',
        messageListener,
      );

      expect(NotificationService.onPushTokenRefresh(tokenListener)).toBe(unsubscribe);
      expect(mockOnTokenRefresh).toHaveBeenCalledWith('messaging-instance', tokenListener);
    });
  });

  describe('getInitialNotification', () => {
    it('gibt die Nachricht zurück, wenn die App darüber gestartet wurde', async () => {
      const message = { messageId: 'msg-1' };
      mockGetInitialNotification.mockResolvedValue(message);

      await expect(NotificationService.getInitialNotification()).resolves.toBe(message);
    });

    it('gibt null zurück, wenn die App nicht über eine Notification gestartet wurde', async () => {
      mockGetInitialNotification.mockResolvedValue(null);

      await expect(NotificationService.getInitialNotification()).resolves.toBeNull();
    });
  });

  describe('registerBackgroundHandler', () => {
    it('registriert einen Background-Handler bei Firebase', () => {
      NotificationService.registerBackgroundHandler();

      expect(mockSetBackgroundMessageHandler).toHaveBeenCalledWith(
        'messaging-instance',
        expect.any(Function),
      );
    });
  });

  describe('parseNotificationTarget', () => {
    function messageWithData(data: RemoteMessage['data']): RemoteMessage {
      return { data, fcmOptions: {} } as RemoteMessage;
    }

    it('erkennt eine Location-Notification', () => {
      const target = NotificationService.parseNotificationTarget(
        messageWithData({ related_type: 'location', related_id: 'loc-1' }),
      );

      expect(target).toEqual({ type: 'location', id: 'loc-1' });
    });

    it('erkennt eine Artist-Notification', () => {
      const target = NotificationService.parseNotificationTarget(
        messageWithData({ related_type: 'artist', related_id: 'artist-1' }),
      );

      expect(target).toEqual({ type: 'artist', id: 'artist-1' });
    });

    it('erkennt eine Event-Notification', () => {
      const target = NotificationService.parseNotificationTarget(
        messageWithData({ related_type: 'event', related_id: 'event-1' }),
      );

      expect(target).toEqual({ type: 'event', id: 'event-1' });
    });

    it('gibt null für einen unbekannten Bezugstyp zurück', () => {
      const target = NotificationService.parseNotificationTarget(
        messageWithData({ related_type: 'unknown', related_id: 'x' }),
      );

      expect(target).toBeNull();
    });

    it('gibt null zurück, wenn kein data-Payload vorhanden ist', () => {
      const target = NotificationService.parseNotificationTarget({
        fcmOptions: {},
      } as RemoteMessage);

      expect(target).toBeNull();
    });
  });
});

describe('NotificationService (Android)', () => {
  const mockCheck = jest.fn();
  const mockRequest = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    // Kein `jest.requireActual('react-native')`: das lädt nach `resetModules()` das komplette
    // react-native-Paket frisch (inkl. DevMenu-Turbo-Modul), das im Jest-Environment nicht registriert
    // ist. NotificationService.ts verwendet aus 'react-native' ausschließlich `Platform`/
    // `PermissionsAndroid` — nur diese beiden werden hier nachgebildet.
    jest.doMock('react-native', () => ({
      Platform: { OS: 'android' },
      PermissionsAndroid: {
        PERMISSIONS: { POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS' },
        RESULTS: { GRANTED: 'granted', DENIED: 'denied' },
        check: mockCheck,
        request: mockRequest,
      },
    }));
  });

  afterEach(() => {
    jest.dontMock('react-native');
    jest.clearAllMocks();
  });

  it('liest den Berechtigungsstatus über PermissionsAndroid.check()', async () => {
    mockCheck.mockResolvedValue(true);

    // Modul nach jest.resetModules() mit gemocktem Platform.OS='android' frisch laden.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NotificationService: AndroidNotificationService } = require('./NotificationService');

    await expect(AndroidNotificationService.getPushPermissionStatus()).resolves.toBe('granted');
    expect(mockCheck).toHaveBeenCalledWith('android.permission.POST_NOTIFICATIONS');
  });

  it('behandelt eine nicht erteilte Berechtigung als undetermined (kein Tri-State unter Android)', async () => {
    mockCheck.mockResolvedValue(false);

    // Modul nach jest.resetModules() mit gemocktem Platform.OS='android' frisch laden.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NotificationService: AndroidNotificationService } = require('./NotificationService');

    await expect(AndroidNotificationService.getPushPermissionStatus()).resolves.toBe(
      'undetermined',
    );
  });

  it('fragt die Berechtigung über PermissionsAndroid.request() an', async () => {
    mockRequest.mockResolvedValue('granted');

    // Modul nach jest.resetModules() mit gemocktem Platform.OS='android' frisch laden.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NotificationService: AndroidNotificationService } = require('./NotificationService');

    await expect(AndroidNotificationService.requestPushPermission()).resolves.toBe('granted');
    expect(mockRequest).toHaveBeenCalledWith('android.permission.POST_NOTIFICATIONS');
  });

  it('übersetzt eine Ablehnung als denied', async () => {
    mockRequest.mockResolvedValue('denied');

    // Modul nach jest.resetModules() mit gemocktem Platform.OS='android' frisch laden.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NotificationService: AndroidNotificationService } = require('./NotificationService');

    await expect(AndroidNotificationService.requestPushPermission()).resolves.toBe('denied');
  });
});
