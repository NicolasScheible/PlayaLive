import { useAvatarUpload } from './useAvatarUpload';
import { useFavoritesCount } from './useFavoritesCount';
import { useOwnReports } from './useOwnReports';
import { useOwnReviews } from './useOwnReviews';
import { useProfile } from './useProfile';
import { useUpdateProfile } from './useUpdateProfile';

// Bündelt alle Profil-Datenquellen für den Screen (CLAUDE.md → Vorgehensweise: keine Business-Logik/
// kein Datenzugriff im Screen, ausschließlich Hooks), analog zu `useHomeDashboard`/
// `useArtistDetailScreen`/`useFavoritesScreen`. Logout ist bewusst NICHT Teil dieses Hooks — Auftrag
// Punkt 6 verlangt explizit den bestehenden `useAuth`-Hook (`features/auth/hooks/useAuth.ts`), der
// direkt im Screen aufgerufen wird (siehe ProfileScreen.tsx), keine Business-Logik-Bündelung hier.
export function useProfileScreen() {
  const profile = useProfile();
  const stats = {
    favorites: useFavoritesCount(),
    reviews: useOwnReviews(),
    reports: useOwnReports(),
  };
  const updateProfile = useUpdateProfile();
  const avatarUpload = useAvatarUpload();

  return {
    profile: profile.profile,
    isLoading: profile.isLoading,
    isError: profile.isError,
    error: profile.error,
    stats,
    updateProfile,
    avatarUpload,
  };
}
