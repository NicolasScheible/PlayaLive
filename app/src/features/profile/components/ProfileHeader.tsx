import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '../../../components/IconButton';
import { theme } from '../../../theme/theme';
import { formatDateFromTimestamp } from '../../../utils/formatDateTime';

// Anzeige gemäß Auftrag Punkt 1: Profilbild, Benutzername, E-Mail, Mitglied seit. Kreisrunde
// Avatar-Darstellung analog zu `ArtistCard.tsx` (docs/DesignSystem.md Kapitel 21: „Kreisrunde Bilder
// für Künstler-/Profilbilder (Avatare)"), hier größer (Hero-Avatar statt Listen-Avatar) — Radius/Größe
// selbst ist laut Kapitel 21 keine offene Designentscheidung, nur die Kreisform. Bearbeiten des
// Profilbilds (Auftrag Punkt 2) über einen Tap auf den Avatar, markiert durch ein IconButton-Badge
// unten rechts (gleiches generisches `IconButton` wie in den Detail-Header-Screens).
//
// „Benutzername" bewusst nur EIN Feld: `profiles` kennt ausschließlich `display_name` — der Auftrag
// listet „Benutzername" und „Anzeigename (falls vorhanden)" als zwei Punkte, das Datenmodell hat aber
// nur ein Feld dafür (`RegisterScreen.tsx` beschriftet es bereits als „Benutzername"). Eine zweite Zeile
// mit identischem Wert wäre keine neue Information, nur eine verwirrende Dopplung — daher hier wie dort
// als „Benutzername" einmalig angezeigt, kein zusätzliches „Anzeigename"-Feld erfunden.
const AVATAR_SIZE = 120;

type ProfileHeaderProps = {
  avatarUrl: string | null;
  username: string | null;
  email: string | null;
  memberSince: string;
  isUploadingAvatar: boolean;
  onPressChangeAvatar: () => void;
};

export function ProfileHeader({
  avatarUrl,
  username,
  email,
  memberSince,
  isUploadingAvatar,
  onPressChangeAvatar,
}: ProfileHeaderProps) {
  const displayName = username ?? 'Ohne Namen';

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        <Pressable onPress={onPressChangeAvatar} accessibilityLabel={displayName}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
          ) : (
            <View style={[styles.avatar, styles.placeholder]}>
              <Text style={styles.placeholderLabel}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </Pressable>
        <View style={styles.editBadge}>
          <IconButton
            glyph={isUploadingAvatar ? '…' : '✎'}
            accessibilityLabel="Profilbild ändern"
            onPress={onPressChangeAvatar}
          />
        </View>
      </View>

      <Text style={styles.username}>{displayName}</Text>
      {email ? <Text style={styles.meta}>{email}</Text> : null}
      <Text style={styles.meta}>Mitglied seit {formatDateFromTimestamp(memberSince)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  avatarWrapper: {
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: theme.colors.border.subtle,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.hero.fontSize,
    fontWeight: '700',
  },
  editBadge: {
    position: 'absolute',
    right: -theme.spacing.xs,
    bottom: -theme.spacing.xs,
  },
  username: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
});
