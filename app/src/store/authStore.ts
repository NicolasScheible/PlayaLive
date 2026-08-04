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
    AuthService.getSession().then(({ session }) => {
      set({ session, isInitializing: false });
    });

    AuthService.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },
}));
