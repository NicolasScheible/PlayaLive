import type { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

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

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
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
      set({ session });
    });
  },
}));
