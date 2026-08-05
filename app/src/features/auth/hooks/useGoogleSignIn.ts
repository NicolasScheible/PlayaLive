import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';

import type { AppError } from '../../../lib/errors';
import { AuthService } from '../../../services/AuthService';

// Muss einmalig beim Modul-Laden aufgerufen werden, damit ein im Browser/Tab abgeschlossener
// Google-Login-Vorgang zurück in die App geleitet wird (siehe expo-auth-session-Dokumentation zu
// `WebBrowser.maybeCompleteAuthSession()`).
WebBrowser.maybeCompleteAuthSession();

function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AppError).code === 'string' &&
    typeof (value as AppError).message === 'string' &&
    typeof (value as AppError).messageKey === 'string'
  );
}

function googleSignInFailedError(): AppError {
  return {
    code: 'AUTH_GOOGLE_SIGN_IN_FAILED',
    messageKey: 'errors.auth.AUTH_GOOGLE_SIGN_IN_FAILED',
    message: 'Die Anmeldung mit Google ist fehlgeschlagen. Bitte versuche es erneut.',
    technicalMessage: 'Google AuthSession did not return an id_token',
  };
}

// Feature-Hook für Google Sign-In (docs/PRD.md Kapitel 12, docs/ADR/002-Authentication.md), analog zu
// `useAuth.ts`/`useAppleSignIn.ts` aufgebaut. Die native AuthSession (`expo-auth-session`) ist ein
// reiner Plattformzugriff ohne Datenzugriff, daher hier im Hook verdrahtet statt im Service. Die
// Client-IDs kommen aus `EXPO_PUBLIC_*`-Umgebungsvariablen (siehe .env.example, docs/Architecture.md
// Kapitel 17 „Sicherheit" — Secrets ausschließlich über Umgebungsvariablen) — solange sie nicht gesetzt
// sind, meldet `isConfigured` das nach außen, statt beim Fehlen hart abzustürzen (Login muss über
// E-Mail/Apple weiterhin nutzbar bleiben).
export function useGoogleSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const isConfigured = Boolean(
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  );
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const signIn = useCallback(async () => {
    if (!isConfigured || !request || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await promptAsync();

      // `cancel`/`dismiss`/`opened`/`locked`: vom Nutzer selbst ausgelöst (Dialog geschlossen) oder ein
      // Zwischenzustand — kein Fehler, der angezeigt werden soll (analog zu `ERR_REQUEST_CANCELED` bei
      // Apple in `useAppleSignIn.ts`).
      if (result.type !== 'success' && result.type !== 'error') {
        return;
      }

      if (result.type === 'error' || !result.params.id_token) {
        throw googleSignInFailedError();
      }

      await AuthService.signInWithGoogle(result.params.id_token);
    } catch (err) {
      setError(isAppError(err) ? err : googleSignInFailedError());
    } finally {
      setLoading(false);
    }
  }, [isConfigured, request, promptAsync, loading]);

  return { isConfigured, loading, error, signIn };
}
