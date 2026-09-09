import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

import { queryClient } from '../lib/queryClient';
import { AuthService } from '../services/AuthService';

// Globaler Client State für den Login-Status (siehe docs/ADR/001-State-Management.md — Zustand
// verwaltet ausschließlich globalen Client-/UI-State, keine dauerhaften Backend-Daten). Datenzugriff
// läuft ausschließlich über den AuthService, nie direkt über Supabase (docs/Architecture.md Kapitel 8).
type AuthState = {
  session: Session | null;
  isInitializing: boolean;
};

type AuthActions = {
  initialize: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  session: null,
  isInitializing: true,

  initialize: () => {
    AuthService.getSession()
      .then(({ session }) => {
        set({ session, isInitializing: false });
      })
      .catch((error) => {
        // Ohne diesen Catch bliebe die App bei einem Fehler hier (z. B. transienter Netzwerkfehler
        // beim kalten Start) dauerhaft auf der LoadingScreen hängen, da `isInitializing` nie auf
        // `false` gesetzt würde — ein Fehlschlag wird daher wie „keine Session" behandelt, der
        // Nutzer landet regulär auf dem Login statt in einer Sackgasse.
        console.error('[authStore] getSession() beim Start fehlgeschlagen:', error);
        set({ session: null, isInitializing: false });
      });

    AuthService.onAuthStateChange((_event, session) => {
      // Der TanStack-Query-Cache wird ausschließlich hier geleert, an der EINEN Stelle, die
      // wirklich jeden Nutzerwechsel sieht — nicht (nur) im expliziten `logout()` (useAuth.ts):
      // eine Session kann auch OHNE den Abmelden-Button ungültig werden (abgelaufener Refresh-Token,
      // Sign-out auf einem anderen Gerät) und `onAuthStateChange` feuert dafür ebenfalls. Ohne diese
      // Prüfung würden zwischengespeicherte Home-/Profil-Daten des vorherigen Nutzers nach einem
      // Accountwechsel auf demselben Gerät kurzzeitig weiter sichtbar bleiben. Verglichen wird die
      // User-ID statt nur „Session vorhanden/nicht vorhanden", damit ein reiner Token-Refresh
      // (`TOKEN_REFRESHED`, gleicher Nutzer) den Cache NICHT unnötig verwirft.
      const previousUserId = get().session?.user?.id ?? null;
      const nextUserId = session?.user?.id ?? null;

      if (previousUserId !== nextUserId) {
        queryClient.clear();
      }

      set({ session });
    });
  },
}));
