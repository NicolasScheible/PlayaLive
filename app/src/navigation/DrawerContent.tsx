import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useProfile } from '../features/profile/hooks/useProfile';
import { useAuthStore } from '../store/authStore';
import { theme } from '../theme/theme';

const AVATAR_SIZE = 64;

// Drawer-Header (Auftrag Punkt 2: „Avatar, Benutzername, E-Mail aus dem bestehenden Auth-/
// Profile-State"). `useProfile()` ist bereits der von Home/Profile genutzte Hook (gleicher Query-Key
// `['home', 'profile']`, siehe features/profile/hooks/useProfile.ts) — beim Öffnen des Drawers wird
// dadurch ausschließlich der ohnehin gecachte Profil-Datensatz gelesen, kein zusätzlicher Request
// (Auftrag Punkt 7 „Performance"). E-Mail kommt wie in `useSettingsScreen.ts` direkt aus der Session im
// `authStore`. Reine Präsentation/Zusammensetzung bestehender Daten, keine eigene Business-Logik.
export function DrawerContent(props: DrawerContentComponentProps) {
  const { profile } = useProfile();
  const session = useAuthStore((state) => state.session);
  const displayName = profile?.display_name ?? 'Ohne Namen';
  const email = session?.user.email ?? null;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        {profile?.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderLabel}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.username}>{displayName}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: theme.colors.border.subtle,
    marginBottom: theme.spacing.xs,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '700',
  },
  username: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
  email: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});
