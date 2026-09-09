import { useCallback, useState } from 'react';

import type { AppError } from '../../../lib/errors';
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

  const login = useCallback(
    async (email: string, password: string) => {
      // Verhindert doppelte Login-Anfragen bei schnellem Mehrfach-Tippen auf „Login" (der Button ist
      // zwar über `loading` deaktiviert, React aktualisiert diesen Zustand aber erst beim nächsten
      // Render — ohne diese Prüfung könnten zwei Tipps im selben Frame beide durchkommen), analog zum
      // bestehenden Muster in `useAppleSignIn.ts` (`if (loading) return;`).
      if (loading) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await AuthService.signInWithPassword(email, password);
      } catch (err) {
        setError(err as AppError);
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  // Gibt zurück, ob die Registrierung erfolgreich war (analog zu `resetPassword`s `boolean`-
  // Rückgabe) — die neue Session (zunächst anonym, siehe AuthService.signUpWithPassword) übernimmt der
  // bestehende `onAuthStateChange`-Listener im `authStore` automatisch, RegisterScreen muss dafür nicht
  // selbst navigieren. `true` bedeutet lediglich „Konto angelegt/Zugangsdaten hinterlegt", nicht „E-Mail
  // bestätigt" — die Bestätigung bleibt laut ADR-002 unabhängig davon offen.
  const register = useCallback(
    async (params: { email: string; password: string; username: string }): Promise<boolean> => {
      if (loading) {
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await AuthService.signUpWithPassword(params);

        return true;
      } catch (err) {
        setError(err as AppError);

        return false;
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  const resetPassword = useCallback(
    async (email: string) => {
      if (loading) {
        return false;
      }

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
    },
    [loading],
  );

  const logout = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Push-Token-Lebenszyklus (docs/ADR/007-Notifications.md „Konsequenzen": „Entfernung bei
      // Logout"). Muss vor `signOut()` passieren — danach fehlt die Session, über die
      // `NotificationService.removePushToken()` den eigenen Profil-Datensatz identifiziert. Ein
      // Fehlschlag (z. B. kein registriertes Token) darf den Logout selbst nicht verhindern.
      await NotificationService.removePushToken().catch(() => undefined);
      await AuthService.signOut();
      // Das Leeren des TanStack-Query-Caches (verhindert sichtbare Daten des vorherigen Nutzers nach
      // dem Logout) übernimmt zentral `authStore.ts` — dort reagiert `onAuthStateChange()` auf JEDEN
      // Nutzerwechsel, nicht nur den expliziten Logout über diesen Hook (siehe dortiger Kommentar).
    } catch (err) {
      setError(err as AppError);
    } finally {
      setLoading(false);
    }
  }, [loading]);

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
