import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { AuthService } from '../../../services/AuthService';
import type { UpdateProfileInput } from '../../../types/dto';
import type { Profile } from '../../../types/entities';

// Bearbeitbare Felder gemäß Auftrag Punkt 2 („Profilbild, Anzeigename, Benutzername (falls laut
// Datenmodell erlaubt)"): `profiles` kennt nur `display_name` — kein separates Benutzername-Feld (siehe
// `ProfileHeader.tsx`/Abschlussbericht) —, daher hier ausschließlich `displayName`/`avatarUrl` über den
// bereits bestehenden `AuthService.updateProfile()`. Invalidiert denselben Query-Key wie `useProfile`/
// `useGreeting` (Home Dashboard), damit beide Stellen nach dem Speichern aktuelle Daten zeigen.
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Profile, AppError, UpdateProfileInput>({
    mutationFn: (input) => AuthService.updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home', 'profile'] });
    },
  });

  return {
    updateProfile: (input: UpdateProfileInput) => mutation.mutateAsync(input),
    isSaving: mutation.isPending,
    error: mutation.error ?? null,
  };
}
