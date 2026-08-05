import { renderHook } from '@testing-library/react-native';

import { useAuthStore } from '../../../store/authStore';

import { useSettingsScreen } from './useSettingsScreen';

describe('useSettingsScreen', () => {
  afterEach(() => {
    useAuthStore.setState({ session: null, isInitializing: false });
  });

  it('liest E-Mail und Verifizierungsstatus direkt aus dem authStore, ohne Request', () => {
    const session = {
      user: {
        id: 'user-1',
        email: 'dj@example.com',
        email_confirmed_at: '2026-01-01T00:00:00.000Z',
      },
    } as never;
    useAuthStore.setState({ session, isInitializing: false });

    const { result } = renderHook(() => useSettingsScreen());

    expect(result.current.email).toBe('dj@example.com');
    expect(result.current.isEmailVerified).toBe(true);
  });

  it('erkennt eine noch nicht bestätigte E-Mail-Adresse', () => {
    const session = {
      user: { id: 'user-1', email: 'dj@example.com', email_confirmed_at: undefined },
    } as never;
    useAuthStore.setState({ session, isInitializing: false });

    const { result } = renderHook(() => useSettingsScreen());

    expect(result.current.isEmailVerified).toBe(false);
  });

  it('liefert null ohne aktive Session', () => {
    useAuthStore.setState({ session: null, isInitializing: false });

    const { result } = renderHook(() => useSettingsScreen());

    expect(result.current.email).toBeNull();
    expect(result.current.isEmailVerified).toBe(false);
  });
});
