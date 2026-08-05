import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { UpdateProfileInput } from '../types/dto';
import type { Profile } from '../types/entities';

// Service Layer für Authentifizierung (siehe docs/Architecture.md Kapitel 8/12 und
// docs/ADR/002-Authentication.md). Einzige Stelle im Code, die mit `supabase.auth` kommuniziert.
// Unterstützte Methoden: E-Mail & Passwort sowie Apple/Google Sign-In (docs/PRD.md Kapitel 12) — Apple
// und Google laufen beide über `supabase.auth.signInWithIdToken()` (Supabase verifiziert das vom
// jeweiligen nativen SDK gelieferte ID-Token serverseitig; die native Anmeldung selbst — Apple-Dialog/
// Google-AuthSession, Nonce-Erzeugung — findet außerhalb dieses Service in den jeweiligen
// `features/auth/hooks/use*SignIn`-Hooks statt, da es sich um Plattform-/Gerätezugriffe ohne
// Datenzugriff handelt, nicht um Business-Logik). Rollenzuweisung, Session-Handling und
// Profilanlage laufen für alle drei Methoden identisch über den bereits bestehenden
// `onAuthStateChange`-Listener im `authStore` — keine Sonderbehandlung nötig.

// Fehlercode-Katalog für Auth, domänenstrukturiert gemäß docs/Architecture.md Kapitel 15
// (Architekturentscheidung 9). Nutzerfreundliche deutsche Texte statt technischer Supabase-Meldungen —
// bewusst KEINE Unterscheidung zwischen „falsches Passwort" und „Nutzer existiert nicht": Supabase
// liefert für beide Fälle absichtlich denselben Fehlercode (`invalid_credentials`), um das Erraten
// existierender Konten (Account-Enumeration) zu verhindern — eine eigene Unterscheidung würde diesen
// Schutz aushebeln und ist daher hier bewusst nicht umgesetzt.
const AUTH_ERROR_MESSAGES = {
  AUTH_INVALID_CREDENTIALS: 'E-Mail oder Passwort ist falsch.',
  AUTH_EMAIL_ALREADY_REGISTERED: 'Für diese E-Mail-Adresse besteht bereits ein Konto.',
  AUTH_WEAK_PASSWORD: 'Das Passwort ist zu kurz.',
  AUTH_EMAIL_NOT_CONFIRMED: 'Bitte bestätige zuerst deine E-Mail-Adresse.',
  AUTH_RATE_LIMITED: 'Zu viele Versuche. Bitte versuche es später erneut.',
  NETWORK_OFFLINE: 'Bitte überprüfe deine Internetverbindung.',
  UNKNOWN_ERROR: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
} as const;

type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;

function mapAuthError(error: unknown): AppError {
  const supabaseCode = isAuthApiError(error) ? error.code : undefined;

  const code: AuthErrorCode = (() => {
    switch (supabaseCode) {
      case 'invalid_credentials':
        return 'AUTH_INVALID_CREDENTIALS';
      case 'user_already_exists':
      case 'email_exists':
        return 'AUTH_EMAIL_ALREADY_REGISTERED';
      case 'weak_password':
        return 'AUTH_WEAK_PASSWORD';
      case 'email_not_confirmed':
        return 'AUTH_EMAIL_NOT_CONFIRMED';
      case 'over_email_send_rate_limit':
      case 'over_request_rate_limit':
        return 'AUTH_RATE_LIMITED';
      default:
        return isAuthRetryableFetchError(error) || error instanceof TypeError
          ? 'NETWORK_OFFLINE'
          : 'UNKNOWN_ERROR';
    }
  })();

  return {
    code,
    messageKey: `errors.auth.${code}`,
    message: AUTH_ERROR_MESSAGES[code],
    technicalMessage: error instanceof Error ? error.message : String(error),
  };
}

function sessionMissingError(): AppError {
  return {
    code: 'AUTH_SESSION_MISSING',
    messageKey: 'errors.auth.AUTH_SESSION_MISSING',
    message: 'Du musst angemeldet sein, um diese Aktion auszuführen.',
    technicalMessage: 'No active session',
  };
}

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

  async signInWithPassword(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw mapAuthError(error);
    }
  },

  async signUpWithPassword(params: {
    email: string;
    password: string;
    username: string;
  }): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: { data: { username: params.username } },
    });

    if (error) {
      throw mapAuthError(error);
    }
  },

  async resetPasswordForEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw mapAuthError(error);
    }
  },

  // docs/PRD.md Kapitel 12 „Apple Sign-In". `identityToken` kommt vom nativen
  // `expo-apple-authentication`-Dialog (siehe `useAppleSignIn.ts`); `nonce` ist optional, wird aber vom
  // Hook immer mitgegeben (Schutz vor Replay-Angriffen, siehe Supabase-Dokumentation zu
  // `signInWithIdToken`: „If the token contains a nonce claim you must supply the nonce used to obtain
  // the ID token.").
  async signInWithApple(params: { identityToken: string; nonce?: string }): Promise<void> {
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: params.identityToken,
      nonce: params.nonce,
    });

    if (error) {
      throw mapAuthError(error);
    }
  },

  // docs/PRD.md Kapitel 12 „Google Sign-In". `idToken` kommt aus der `expo-auth-session`-Google-
  // AuthSession (siehe `useGoogleSignIn.ts`). Kein Nonce nötig — die von `expo-auth-session` bezogenen
  // Google-ID-Tokens enthalten standardmäßig keinen `nonce`-Claim, den Supabase prüfen müsste.
  async signInWithGoogle(idToken: string): Promise<void> {
    const { error } = await supabase.auth.signInWithIdToken({ provider: 'google', token: idToken });

    if (error) {
      throw mapAuthError(error);
    }
  },

  signOut(): Promise<void> {
    return supabase.auth.signOut().then(() => undefined);
  },

  // Settings → Konto → „Passwort ändern" (im Unterschied zu `resetPasswordForEmail`: ändert das
  // Passwort direkt für die bereits angemeldete Session, kein E-Mail-Link nötig). Nutzt
  // `supabase.auth.updateUser()` — bereits Teil des installierten Supabase-SDK, keine neue
  // Abhängigkeit/Architektur, analog zu den übrigen `supabase.auth.*`-Aufrufen in diesem Service.
  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      throw mapAuthError(error);
    }
  },

  // docs/API.md Kapitel 2 „Nutzerprofil aktualisieren (Anzeigename, Profilbild)" — dort unter
  // Authentication gruppiert, daher hier statt in einem eigenen, nicht dokumentierten ProfileService
  // (docs/Architecture.md Kapitel 8 nennt keinen solchen Service). Greift auf `profiles` zu, nicht auf
  // `supabase.auth` — die „nur AuthService ruft supabase.auth auf"-Regel bleibt davon unberührt.
  async getProfile(): Promise<Profile | null> {
    const { session } = await this.getSession();

    if (!session) {
      throw sessionMissingError();
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  async updateProfile(input: UpdateProfileInput): Promise<Profile> {
    const { session } = await this.getSession();

    if (!session) {
      throw sessionMissingError();
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...(input.displayName !== undefined && { display_name: input.displayName }),
        ...(input.avatarUrl !== undefined && { avatar_url: input.avatarUrl }),
      })
      .eq('id', session.user.id)
      .select('*')
      .single();

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },
};
