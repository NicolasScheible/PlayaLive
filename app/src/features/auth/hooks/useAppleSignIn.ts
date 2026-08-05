import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { useCallback, useEffect, useState } from 'react';

import type { AppError } from '../../../lib/errors';
import { AuthService } from '../../../services/AuthService';

function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AppError).code === 'string' &&
    typeof (value as AppError).message === 'string' &&
    typeof (value as AppError).messageKey === 'string'
  );
}

function appleSignInFailedError(): AppError {
  return {
    code: 'AUTH_APPLE_SIGN_IN_FAILED',
    messageKey: 'errors.auth.AUTH_APPLE_SIGN_IN_FAILED',
    message: 'Die Anmeldung mit Apple ist fehlgeschlagen. Bitte versuche es erneut.',
    technicalMessage: 'Apple Sign-In did not return an identityToken',
  };
}

// `expo-apple-authentication` liefert `ERR_REQUEST_CANCELED`, wenn der Nutzer den System-Dialog
// selbst abbricht — kein echter Fehler, der dem Nutzer angezeigt werden soll (analog zu einer
// verweigerten Standortberechtigung in `useUserLocation.ts`).
function isUserCancelledError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'ERR_REQUEST_CANCELED'
  );
}

// Feature-Hook für Apple Sign-In (docs/PRD.md Kapitel 12, docs/ADR/002-Authentication.md), analog zu
// `useAuth.ts` aufgebaut (lokaler loading/error-State, ruft ausschließlich den bestehenden
// `AuthService` auf). Die native Anmeldung selbst (`AppleAuthentication.signInAsync`) ist ein reiner
// Plattformzugriff ohne Datenzugriff, daher hier im Hook verdrahtet statt im Service — analog zu
// `Location.getForegroundPermissionsAsync()` in `useUserLocation.ts`. Nonce wird selbst erzeugt
// (`expo-crypto`, SHA-256-Hash an Apple, Rohwert an Supabase) — Standard-Schutz vor Replay-Angriffen,
// von Supabase für `signInWithIdToken` empfohlen, sobald das ID-Token einen `nonce`-Claim enthält.
export function useAppleSignIn() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    let isMounted = true;

    AppleAuthentication.isAvailableAsync().then((available) => {
      if (isMounted) {
        setIsAvailable(available);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rawNonce = Crypto.randomUUID();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce,
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        throw appleSignInFailedError();
      }

      await AuthService.signInWithApple({
        identityToken: credential.identityToken,
        nonce: rawNonce,
      });
    } catch (err) {
      if (!isUserCancelledError(err)) {
        setError(isAppError(err) ? err : appleSignInFailedError());
      }
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return { isAvailable, loading, error, signIn };
}
