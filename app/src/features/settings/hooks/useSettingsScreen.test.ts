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
        is_anonymous: false,
      },
    } as never;
    useAuthStore.setState({ session, isInitializing: false });

    const { result } = renderHook(() => useSettingsScreen());

    expect(result.current.email).toBe('dj@example.com');
    expect(result.current.isEmailVerified).toBe(true);
  });

  // ADR-002/Option E: Registrierung erzeugt zunächst eine anonyme Session — bis zum Klick auf den
  // Bestätigungslink bleibt `is_anonymous` `true`, unabhängig davon, dass bereits eine E-Mail-Adresse
  // per `updateUser()` hinterlegt wurde.
  it('erkennt eine noch nicht bestätigte E-Mail-Adresse (anonyme Session)', () => {
    const session = {
      user: { id: 'user-1', email: 'dj@example.com', is_anonymous: true },
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
