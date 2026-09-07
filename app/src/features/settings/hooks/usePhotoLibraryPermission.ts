import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useState } from 'react';

// Berechtigungsübersicht (Datenschutz → „Berechtigungen"). Struktur 1:1 nach dem Muster von
// `useUserLocation.ts` (geteilter Hook, `src/hooks/`): liest beim Mount nur den bereits bestehenden
// Berechtigungsstatus (kein automatisches Anfragen), das eigentliche Anfragen übernimmt
// `requestPermission()` auf Tippen des Nutzers. `expo-image-picker` ist bereits installiert (siehe
// `useAvatarUpload.ts`, Profil-Feature) — keine neue Abhängigkeit.
export type PhotoLibraryPermissionStatus = 'undetermined' | 'granted' | 'denied';

function toPermissionStatus(status: ImagePicker.PermissionStatus): PhotoLibraryPermissionStatus {
  switch (status) {
    case ImagePicker.PermissionStatus.GRANTED:
      return 'granted';
    case ImagePicker.PermissionStatus.DENIED:
      return 'denied';
    default:
      return 'undetermined';
  }
}

export function usePhotoLibraryPermission() {
  const [status, setStatus] = useState<PhotoLibraryPermissionStatus>('undetermined');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    ImagePicker.getMediaLibraryPermissionsAsync()
      .then((response) => {
        if (isMounted) {
          setStatus(toPermissionStatus(response.status));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(
          '[usePhotoLibraryPermission] getMediaLibraryPermissionsAsync() fehlgeschlagen:',
          error,
        );

        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const requestPermission = useCallback(async (): Promise<PhotoLibraryPermissionStatus> => {
    const response = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const nextStatus = toPermissionStatus(response.status);
    setStatus(nextStatus);

    return nextStatus;
  }, []);

  return { status, isLoading, requestPermission };
}
