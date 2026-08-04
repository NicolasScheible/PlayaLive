import { NotificationService } from './NotificationService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();
const mockGetSession = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

jest.mock('./AuthService', () => ({
  AuthService: { getSession: (...args: unknown[]) => mockGetSession(...args) },
}));

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
});
