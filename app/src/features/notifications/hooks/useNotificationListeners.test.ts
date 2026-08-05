import { renderHook, waitFor } from '@testing-library/react-native';

import { useNotificationListeners } from './useNotificationListeners';

const mockGetInitialNotification = jest.fn();
const mockOnNotificationOpened = jest.fn();
const mockOnPushTokenRefresh = jest.fn();
const mockRegisterPushToken = jest.fn();
const mockParseNotificationTarget = jest.fn();
const mockNavigate = jest.fn();
const mockIsReady = jest.fn();

jest.mock('../../../navigation/navigationRef', () => ({
  navigationRef: {
    isReady: () => mockIsReady(),
    navigate: (...args: unknown[]) => mockNavigate(...args),
  },
}));

jest.mock('../../../services/NotificationService', () => ({
  NotificationService: {
    getInitialNotification: (...args: unknown[]) => mockGetInitialNotification(...args),
    onNotificationOpened: (...args: unknown[]) => mockOnNotificationOpened(...args),
    onPushTokenRefresh: (...args: unknown[]) => mockOnPushTokenRefresh(...args),
    registerPushToken: (...args: unknown[]) => mockRegisterPushToken(...args),
    parseNotificationTarget: (...args: unknown[]) => mockParseNotificationTarget(...args),
  },
}));

describe('useNotificationListeners', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetInitialNotification.mockResolvedValue(null);
    mockOnNotificationOpened.mockReturnValue(jest.fn());
    mockOnPushTokenRefresh.mockReturnValue(jest.fn());
    mockIsReady.mockReturnValue(true);
  });

  it('navigiert zum Location-Detail-Screen, wenn die App über eine Notification gestartet wurde', async () => {
    const message = { data: { related_type: 'location', related_id: 'loc-1' } };
    mockGetInitialNotification.mockResolvedValue(message);
    mockParseNotificationTarget.mockReturnValue({ type: 'location', id: 'loc-1' });

    renderHook(() => useNotificationListeners());

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('LocationDetail', { locationId: 'loc-1' }),
    );
  });

  it('navigiert nicht, wenn die App nicht über eine Notification gestartet wurde', async () => {
    renderHook(() => useNotificationListeners());

    await waitFor(() => expect(mockGetInitialNotification).toHaveBeenCalledTimes(1));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigiert zum Artist-Detail-Screen beim Antippen einer Notification im Hintergrund', () => {
    let openedListener: (message: unknown) => void = () => undefined;
    mockOnNotificationOpened.mockImplementation((listener) => {
      openedListener = listener;

      return jest.fn();
    });
    mockParseNotificationTarget.mockReturnValue({ type: 'artist', id: 'artist-1' });

    renderHook(() => useNotificationListeners());
    openedListener({ data: { related_type: 'artist', related_id: 'artist-1' } });

    expect(mockNavigate).toHaveBeenCalledWith('ArtistDetail', { artistId: 'artist-1' });
  });

  it('navigiert zum Event-Detail-Screen beim Antippen einer Notification im Hintergrund', () => {
    let openedListener: (message: unknown) => void = () => undefined;
    mockOnNotificationOpened.mockImplementation((listener) => {
      openedListener = listener;

      return jest.fn();
    });
    mockParseNotificationTarget.mockReturnValue({ type: 'event', id: 'event-1' });

    renderHook(() => useNotificationListeners());
    openedListener({ data: { related_type: 'event', related_id: 'event-1' } });

    expect(mockNavigate).toHaveBeenCalledWith('EventDetail', { eventId: 'event-1' });
  });

  it('navigiert nicht, wenn der Navigations-Container noch nicht bereit ist', () => {
    mockIsReady.mockReturnValue(false);
    let openedListener: (message: unknown) => void = () => undefined;
    mockOnNotificationOpened.mockImplementation((listener) => {
      openedListener = listener;

      return jest.fn();
    });
    mockParseNotificationTarget.mockReturnValue({ type: 'location', id: 'loc-1' });

    renderHook(() => useNotificationListeners());
    openedListener({ data: { related_type: 'location', related_id: 'loc-1' } });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('registriert ein aktualisiertes Push-Token', () => {
    let tokenListener: (token: string) => void = () => undefined;
    mockOnPushTokenRefresh.mockImplementation((listener) => {
      tokenListener = listener;

      return jest.fn();
    });
    mockRegisterPushToken.mockResolvedValue(undefined);

    renderHook(() => useNotificationListeners());
    tokenListener('new-fcm-token');

    expect(mockRegisterPushToken).toHaveBeenCalledWith('new-fcm-token');
  });

  it('meldet sich beim Unmount von beiden Listenern ab', () => {
    const unsubscribeOpened = jest.fn();
    const unsubscribeTokenRefresh = jest.fn();
    mockOnNotificationOpened.mockReturnValue(unsubscribeOpened);
    mockOnPushTokenRefresh.mockReturnValue(unsubscribeTokenRefresh);

    const { unmount } = renderHook(() => useNotificationListeners());
    unmount();

    expect(unsubscribeOpened).toHaveBeenCalledTimes(1);
    expect(unsubscribeTokenRefresh).toHaveBeenCalledTimes(1);
  });
});
