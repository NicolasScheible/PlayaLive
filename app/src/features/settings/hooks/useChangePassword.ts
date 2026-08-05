import { useMutation } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { AuthService } from '../../../services/AuthService';

// Analog zu `useUpdateProfile.ts` (Profile-Feature) — `useMutation` um eine AuthService-Aktion, ohne
// Cache-Invalidierung (Passwortänderung beeinflusst keine gecachten Daten). Keine neue
// Business-Logik: Validierung/Fehlerübersetzung laufen bereits in `AuthService.changePassword()`.
export function useChangePassword() {
  const mutation = useMutation<void, AppError, string>({
    mutationFn: (newPassword) => AuthService.changePassword(newPassword),
  });

  return {
    changePassword: (newPassword: string) => mutation.mutateAsync(newPassword),
    isSaving: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error ?? null,
  };
}
