import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import type { AppError } from '../../../lib/errors';
import { AuthService } from '../../../services/AuthService';
import type { PushPermissionStatus } from '../../../services/NotificationService';
import { NotificationService } from '../../../services/NotificationService';
import type { Profile } from '../../../types/entities';

// Settings → App → „Benachrichtigungen" (Auftrag Punkt 7). Liest `push_notifications_enabled` über
// denselben Query-Key wie `useProfile`/`useGreeting` (`['home', 'profile']`) — kein zusätzlicher
// Request, da die Spalte ohnehin Teil des bereits geladenen Profils ist (Auftrag Punkt 8: „bestehende
// Query Keys verwenden"). Der Push-Berechtigungsstatus wird beim Mount NUR gelesen (analog zu
// `useUserLocation`/`usePhotoLibraryPermission`), nie automatisch angefragt — die Anfrage passiert
// ausschließlich beim expliziten Einschalten des Schalters, und nur, wenn der Status noch
// `undetermined` ist (Auftrag Punkt 3: „keine mehrfachen Permission-Dialoge").
export function useNotificationSettings() {
  const queryClient = useQueryClient();
  const profileQuery = useQuery<Profile | null, AppError>({
    queryKey: ['home', 'profile'],
    queryFn: () => AuthService.getProfile(),
  });

  const [permissionStatus, setPermissionStatus] = useState<PushPermissionStatus>('undetermined');

  useEffect(() => {
    let isMounted = true;

    NotificationService.getPushPermissionStatus().then((status) => {
      if (isMounted) {
        setPermissionStatus(status);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const mutation = useMutation<void, AppError, boolean>({
    mutationFn: async (nextEnabled) => {
      if (!nextEnabled) {
        await NotificationService.updateNotificationSettings(false);

        return;
      }

      let status = permissionStatus;

      if (status === 'undetermined') {
        status = await NotificationService.requestPushPermission();
        setPermissionStatus(status);
      }

      // Bereits verweigert (oder gerade erst verweigert): keine erneute Anfrage, der Schalter bleibt
      // aus. Die aufrufende UI zeigt dafür denselben „In den Einstellungen erlauben"-Hinweis wie
      // `PermissionsScreen.tsx`.
      if (status !== 'granted') {
        return;
      }

      const token = await NotificationService.getPushToken();
      await NotificationService.registerPushToken(token);
      await NotificationService.updateNotificationSettings(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home', 'profile'] });
    },
  });

  const toggle = useCallback(
    (nextEnabled: boolean) => mutation.mutateAsync(nextEnabled),
    [mutation],
  );

  return {
    enabled: profileQuery.data?.push_notifications_enabled ?? false,
    permissionStatus,
    isLoading: profileQuery.isLoading,
    isSaving: mutation.isPending,
    error: profileQuery.error ?? mutation.error ?? null,
    toggle,
  };
}
