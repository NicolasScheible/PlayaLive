import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

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
// Datenzugriff handelt, nicht um Business-Logik). E-Mail & Passwort läuft über eine anonyme Session,
// die per `updateUser()` zu einem permanenten Account erweitert wird (siehe `signUpWithPassword()`
// unten). Rollenzuweisung, Session-Handling und Profilanlage laufen für alle drei Methoden identisch
// über den bereits bestehenden `onAuthStateChange`-Listener im `authStore` — keine Sonderbehandlung
// nötig.

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
  AUTH_LINK_INVALID:
    'Der Link ist ungültig oder abgelaufen. Bitte fordere eine neue Bestätigungs-E-Mail an.',
  AUTH_ANONYMOUS_SIGN_IN_DISABLED:
    'Registrierung ist aktuell nicht verfügbar. Bitte versuche es später erneut.',
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
      case 'anonymous_provider_disabled':
        return 'AUTH_ANONYMOUS_SIGN_IN_DISABLED';
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

function authLinkInvalidError(technicalMessage: string): AppError {
  return {
    code: 'AUTH_LINK_INVALID',
    messageKey: 'errors.auth.AUTH_LINK_INVALID',
    message: AUTH_ERROR_MESSAGES.AUTH_LINK_INVALID,
    technicalMessage,
  };
}

// E-Mail-Bestätigungs-Link (siehe docs/Architecture.md Kapitel 12 „E-Mail-Bestätigung: Redirect-URL").
// Wird sowohl vom `updateUser()`-Bestätigungslink (Registrierung, `type=email_change`) als auch von
// einem etwaigen künftigen `type=recovery`/`type=signup`-Link verwendet — die URL-Form hängt nicht vom
// `type`-Parameter ab, sondern ausschließlich vom Supabase-`flowType` (Client-weite Einstellung).
// `detectSessionInUrl: false` in lib/supabase.ts ist für native Apps korrekt gesetzt (kein
// `window.location`) — die eingehende URL muss daher hier manuell ausgewertet werden. Je nach
// Supabase-`flowType` (siehe createClient()-Konfiguration; Standard ist `implicit`, siehe
// GoTrueClient-Default) liefert der Link entweder Access-/Refresh-Token im URL-Fragment (Implicit
// Flow) oder einen `code`-Query-Parameter (PKCE) — beide Formen werden unterstützt, statt eines davon
// anzunehmen.
const AUTH_CALLBACK_URL = Linking.createURL('auth/callback', { scheme: 'playalive' });

function parseAuthCallbackUrl(url: string): {
  code?: string;
  accessToken?: string;
  refreshToken?: string;
  errorDescription?: string;
} {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return {};
  }

  const queryParams = new URLSearchParams(parsed.search);
  const fragmentParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));

  return {
    code: queryParams.get('code') ?? fragmentParams.get('code') ?? undefined,
    accessToken: fragmentParams.get('access_token') ?? queryParams.get('access_token') ?? undefined,
    refreshToken:
      fragmentParams.get('refresh_token') ?? queryParams.get('refresh_token') ?? undefined,
    errorDescription:
      queryParams.get('error_description') ?? fragmentParams.get('error_description') ?? undefined,
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

  // Registrierung nach ADR-002 „E-Mail-Verifizierung": die App ist sofort nach der Registrierung
  // nutzbar, auch unverifiziert — mit `supabase.auth.signUp()` allein nicht gleichzeitig mit einer
  // echten, bis zum Klick fortbestehenden Verifizierungslücke erreichbar (die projektweite „Confirm
  // email"-Einstellung ist binär: entweder liefert signUp() sofort eine Session UND setzt
  // `email_confirmed_at` sofort, oder sie liefert gar keine Session bis zum Klick — siehe
  // GoTrueClient.js-JSDoc zu `signUp()`). Stattdessen: `signInAnonymously()` erzeugt sofort eine echte
  // Session (native, nicht simulierte Nutzbarkeit), danach hängt `updateUser({ email, password })`
  // Zugangsdaten an genau diesen bereits bestehenden Nutzer an — kein zweiter Account. Solange der per
  // `emailRedirectTo` verschickte Bestätigungslink nicht angeklickt wurde, bleibt der native
  // `is_anonymous`-Claim `true` (siehe useSettingsScreen.ts, RLS-Policies für Reports/Reviews) — kein
  // eigenes `profiles`-Verifizierungsfeld nötig. `getSession()` verhindert einen zweiten anonymen
  // Nutzer, falls `updateUser()` bei einem vorherigen Versuch fehlgeschlagen ist und erneut
  // registriert wird.
  async signUpWithPassword(params: {
    email: string;
    password: string;
    username: string;
  }): Promise<void> {
    const { session } = await this.getSession();

    if (!session) {
      const { error: anonymousSignInError } = await supabase.auth.signInAnonymously({
        options: { data: { username: params.username } },
      });

      if (anonymousSignInError) {
        throw mapAuthError(anonymousSignInError);
      }
    }

    const { error } = await supabase.auth.updateUser(
      { email: params.email, password: params.password },
      { emailRedirectTo: AUTH_CALLBACK_URL },
    );

    if (error) {
      throw mapAuthError(error);
    }
  },

  // Verarbeitet den Link aus der Bestätigungs-E-Mail (siehe useAuthDeepLink.ts, gemountet in App.tsx).
  // Übergibt eine erkannte Session ausschließlich über `setSession`/`exchangeCodeForSession` an das
  // Supabase-SDK — das löst intern denselben `onAuthStateChange`-Event aus wie jeder andere Login, der
  // bestehende Listener im authStore übernimmt die Session daher automatisch, ohne eigenen Zustand hier.
  // Enthält die URL keine erkennbaren Auth-Parameter (z. B. ein App-Start ohne Deep Link), passiert
  // bewusst nichts — kein Fehlerzustand für einen ganz normalen App-Start.
  async handleAuthCallbackUrl(url: string): Promise<void> {
    const { code, accessToken, refreshToken, errorDescription } = parseAuthCallbackUrl(url);

    if (errorDescription) {
      throw authLinkInvalidError(errorDescription);
    }

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        throw mapAuthError(error);
      }

      return;
    }

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        throw mapAuthError(error);
      }
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
