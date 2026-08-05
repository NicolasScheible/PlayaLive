import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { AuthService } from '../../../services/AuthService';
import type { Profile } from '../../../types/entities';

// Gleicher Query-Key wie `useGreeting.ts` (Home Dashboard) — dieselbe `AuthService.getProfile()`-Antwort,
// dadurch Cache-Wiederverwendung zwischen Home Dashboard und Profil-Screen (keine doppelte Abfrage).
export function useProfile() {
  const query = useQuery<Profile | null, AppError>({
    queryKey: ['home', 'profile'],
    queryFn: () => AuthService.getProfile(),
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
  };
}
