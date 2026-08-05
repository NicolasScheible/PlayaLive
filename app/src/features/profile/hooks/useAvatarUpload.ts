import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';

import type { AppError } from '../../../lib/errors';
import { AuthService } from '../../../services/AuthService';
import { StorageService } from '../../../services/StorageService';
import type { Profile } from '../../../types/entities';

// Profilbild bearbeiten (Auftrag Punkt 3): Bildauswahl über `expo-image-picker`, Upload ausschließlich
// über den bestehenden `StorageService`, danach `AuthService.updateProfile({ avatarUrl })` — beide
// bereits bestehende Services, keine neue Upload-/Business-Logik in diesem Hook. Die
// Mediathek-Berechtigung wird erst beim tatsächlichen Tippen auf „Profilbild ändern" angefragt (nicht
// automatisch beim Laden des Screens), analog zu `useUserLocation.ts`. `null` als Ergebnis bedeutet
// „abgebrochen/keine Berechtigung" — kein Fehlerzustand, der Nutzer hat die Aktion selbst beendet.
export function useAvatarUpload() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Profile | null, AppError>({
    mutationFn: async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      const avatarUrl = await StorageService.uploadAvatar({
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'image/jpeg',
      });

      return AuthService.updateProfile({ avatarUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home', 'profile'] });
    },
  });

  return {
    pickAndUploadAvatar: () => mutation.mutate(),
    isUploading: mutation.isPending,
    error: mutation.error ?? null,
  };
}
