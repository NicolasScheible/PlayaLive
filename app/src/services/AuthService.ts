import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';

// Service Layer für Authentifizierung (siehe docs/Architecture.md Kapitel 8/12 und
// docs/ADR/002-Authentication.md). Einzige Stelle im Code, die mit `supabase.auth` kommuniziert —
// Login-/Registrierungs-Methoden (Apple/Google/E-Mail), Passwort-Reset und E-Mail-Verifizierung folgen
// mit dem Auth-Feature; hier nur die für das Routing zwischen Login und Haupt-App nötige
// Session-Grundlage.
export const AuthService = {
  getSession(): Promise<{ session: Session | null }> {
    return supabase.auth.getSession().then(({ data }) => ({ session: data.session }));
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);

    return subscription;
  },

  signOut(): Promise<void> {
    return supabase.auth.signOut().then(() => undefined);
  },
};
