import { useCallback, useState } from 'react';

import type { AppError } from '../../../lib/errors';
import { queryClient } from '../../../lib/queryClient';
import { AuthService } from '../../../services/AuthService';
import { NotificationService } from '../../../services/NotificationService';
import { useAuthStore } from '../../../store/authStore';

// Feature-Hook für Auth (siehe docs/Architecture.md Kapitel 5/6): kapselt die Kommunikation zwischen
// den Auth-Screens und dem Service Layer. `loading`/`error` sind lokaler UI-Zustand einer laufenden
// Aktion (docs/ADR/001-State-Management.md — Ladezustände gehören zu React State, nicht zu Zustand);
// `session`/`user` kommen aus dem globalen `authStore`, der über den bereits bestehenden
// `onAuthStateChange`-Listener automatisch aktualisiert wird — nach einem erfolgreichen Login/Logout ist
// daher keine manuelle Store-Aktualisierung hier nötig.
export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.signInWithPassword(email, password);
    } catch (err) {
      setError(err as AppError);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (params: { email: string; password: string; username: string }) => {
      setLoading(true);
      setError(null);

      try {
        await AuthService.signUpWithPassword(params);
      } catch (err) {
        setError(err as AppError);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      await AuthService.resetPasswordForEmail(email);

      return true;
    } catch (err) {
      setError(err as AppError);

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Push-Token-Lebenszyklus (docs/ADR/007-Notifications.md „Konsequenzen": „Entfernung bei
      // Logout"). Muss vor `signOut()` passieren — danach fehlt die Session, über die
      // `NotificationService.removePushToken()` den eigenen Profil-Datensatz identifiziert. Ein
      // Fehlschlag (z. B. kein registriertes Token) darf den Logout selbst nicht verhindern.
      await NotificationService.removePushToken().catch(() => undefined);
      await AuthService.signOut();
      // Verhindert, dass zwischengespeicherte Daten des vorherigen Nutzers nach dem Logout sichtbar
      // bleiben (z. B. bei Gerätewechsel/Mehrfachnutzung desselben Geräts).
      queryClient.clear();
    } catch (err) {
      setError(err as AppError);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    error,
    login,
    register,
    resetPassword,
    logout,
  };
}
