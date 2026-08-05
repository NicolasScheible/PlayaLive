import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '../../../components/Button';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { LoadingState } from '../../../components/LoadingState';
import type { MainDrawerParamList, MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { useAuth } from '../../auth/hooks/useAuth';
import { OwnReportsSection } from '../components/OwnReportsSection';
import { OwnReviewsSection } from '../components/OwnReviewsSection';
import { ProfileEditForm } from '../components/ProfileEditForm';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileStatsSection } from '../components/ProfileStatsSection';
import { useProfileScreen } from '../hooks/useProfileScreen';

// „Profile" ist seit der finalen Drawer-Navigation ein Screen des verschachtelten
// `MainDrawerNavigator` (siehe navigation/types.ts) — Navigation zu den Detail-Screens bleibt auf der
// übergeordneten Stack-Ebene, daher die zusammengesetzte Navigation-Prop (analog zu HomeScreen.tsx).
//
// Vollständiger Profil-Screen (löst den bisherigen Profil-Platzhalter ab), orchestriert über
// `useProfileScreen()` (CLAUDE.md → Vorgehensweise: keine Business-Logik/kein Datenzugriff im Screen,
// ausschließlich Hooks). Logout nutzt Auftrag Punkt 6 zufolge explizit den bestehenden `useAuth`-Hook
// (`features/auth/hooks/useAuth.ts`) direkt im Screen — bewusst NICHT über `useProfileScreen`
// gebündelt, um keine neue Business-Logik-Schicht um einen bereits fertigen Hook zu legen. Dieser
// gezielte, vom Auftrag selbst verlangte Zugriff auf ein anderes Feature-Modul ist eine bewusste
// Ausnahme von der sonst geltenden Feature-Isolation (`features/README.md`) — Abmelden bleibt
// ausschließlich hier, nicht zusätzlich im Drawer (Auftrag Punkt 6 der Drawer-Navigation).
type ProfileScreenNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<MainDrawerParamList, 'Profile'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const screen = useProfileScreen();
  const { logout, loading: isLoggingOut } = useAuth();

  if (screen.isLoading) {
    return <LoadingState label="Profil wird geladen" />;
  }

  if (screen.isError) {
    return (
      <ErrorState message={screen.error?.message ?? 'Das Profil konnte nicht geladen werden.'} />
    );
  }

  if (!screen.profile) {
    return <EmptyState message="Dieses Profil wurde nicht gefunden." />;
  }

  const profile = screen.profile;

  function handlePressReview(review: { target_type: 'location' | 'artist'; target_id: string }) {
    if (review.target_type === 'location') {
      navigation.navigate('LocationDetail', { locationId: review.target_id });
    } else {
      navigation.navigate('ArtistDetail', { artistId: review.target_id });
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ProfileHeader
        avatarUrl={profile.avatar_url}
        username={profile.display_name}
        email={profile.email}
        memberSince={profile.created_at}
        isUploadingAvatar={screen.avatarUpload.isUploading}
        onPressChangeAvatar={screen.avatarUpload.pickAndUploadAvatar}
      />

      <ProfileStatsSection
        trustScore={profile.trust_score}
        reportsCount={profile.reports_count}
        reviewsCount={screen.stats.reviews.reviews.length}
        favoritesCount={screen.stats.favorites.count}
      />

      <ProfileEditForm
        initialUsername={profile.display_name ?? ''}
        isSaving={screen.updateProfile.isSaving}
        onSave={(username) => screen.updateProfile.updateProfile({ displayName: username })}
      />

      <OwnReviewsSection
        reviews={screen.stats.reviews.reviews}
        isLoading={screen.stats.reviews.isLoading}
        isError={screen.stats.reviews.isError}
        error={screen.stats.reviews.error}
        onPressReview={handlePressReview}
      />

      <OwnReportsSection
        reports={screen.stats.reports.reports}
        isLoading={screen.stats.reports.isLoading}
        isError={screen.stats.reports.isError}
        error={screen.stats.reports.error}
      />

      <View style={styles.logoutButton}>
        <Button label="Abmelden" variant="secondary" onPress={logout} loading={isLoggingOut} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  logoutButton: {
    paddingHorizontal: theme.spacing.md,
  },
});
