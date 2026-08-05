import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useNotificationSettings } from './useNotificationSettings';

const mockGetProfile = jest.fn();
const mockGetPushPermissionStatus = jest.fn();
const mockRequestPushPermission = jest.fn();
const mockGetPushToken = jest.fn();
const mockRegisterPushToken = jest.fn();
const mockUpdateNotificationSettings = jest.fn();

jest.mock('../../../services/AuthService', () => ({
  AuthService: { getProfile: (...args: unknown[]) => mockGetProfile(...args) },
}));

jest.mock('../../../services/NotificationService', () => ({
  NotificationService: {
    getPushPermissionStatus: (...args: unknown[]) => mockGetPushPermissionStatus(...args),
    requestPushPermission: (...args: unknown[]) => mockRequestPushPermission(...args),
    getPushToken: (...args: unknown[]) => mockGetPushToken(...args),
    registerPushToken: (...args: unknown[]) => mockRegisterPushToken(...args),
    updateNotificationSettings: (...args: unknown[]) => mockUpdateNotificationSettings(...args),
  },
}));

const profile = { id: 'user-1', push_notifications_enabled: false };

describe('useNotificationSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetProfile.mockResolvedValue(profile);
    mockGetPushPermissionStatus.mockResolvedValue('undetermined');
  });

  it('fragt beim Mount NICHT automatisch die Push-Berechtigung an, sondern liest nur den Status', async () => {
    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissionStatus).toBe('undetermined');
    expect(result.current.enabled).toBe(false);
    expect(mockRequestPushPermission).not.toHaveBeenCalled();
  });

  it('fragt beim Einschalten mit undetermined-Status die Berechtigung an und registriert das Token', async () => {
    mockRequestPushPermission.mockResolvedValue('granted');
    mockGetPushToken.mockResolvedValue('fcm-token-123');
    mockRegisterPushToken.mockResolvedValue(undefined);
    mockUpdateNotificationSettings.mockResolvedValue({
      ...profile,
      push_notifications_enabled: true,
    });

    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggle(true);
    });

    expect(mockRequestPushPermission).toHaveBeenCalledTimes(1);
    expect(mockGetPushToken).toHaveBeenCalledTimes(1);
    expect(mockRegisterPushToken).toHaveBeenCalledWith('fcm-token-123');
    expect(mockUpdateNotificationSettings).toHaveBeenCalledWith(true);
  });

  it('registriert kein Token, wenn die Berechtigung abgelehnt wird', async () => {
    mockRequestPushPermission.mockResolvedValue('denied');

    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggle(true);
    });

    expect(result.current.permissionStatus).toBe('denied');
    expect(mockGetPushToken).not.toHaveBeenCalled();
    expect(mockUpdateNotificationSettings).not.toHaveBeenCalled();
  });

  it('fragt nicht erneut an, wenn die Berechtigung bereits verweigert wurde', async () => {
    mockGetPushPermissionStatus.mockResolvedValue('denied');

    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.permissionStatus).toBe('denied'));

    await act(async () => {
      await result.current.toggle(true);
    });

    expect(mockRequestPushPermission).not.toHaveBeenCalled();
    expect(mockUpdateNotificationSettings).not.toHaveBeenCalled();
  });

  it('deaktiviert Benachrichtigungen ohne Berechtigungsanfrage', async () => {
    mockUpdateNotificationSettings.mockResolvedValue({
      ...profile,
      push_notifications_enabled: false,
    });

    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createQueryWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggle(false);
    });

    expect(mockUpdateNotificationSettings).toHaveBeenCalledWith(false);
    expect(mockRequestPushPermission).not.toHaveBeenCalled();
  });
});
