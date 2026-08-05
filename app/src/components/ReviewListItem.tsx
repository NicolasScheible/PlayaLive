import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';
import { formatRelativeTime } from '../utils/formatDateTime';

import { StarRating } from './StarRating';

// Listenzeile für eine einzelne Bewertung, gemäß docs/DesignSystem.md Kapitel 18 „Kompakte
// Listenzeile ... durch dünne Trennlinien/Abstand statt Cards getrennt". Zeigt bewusst keinen
// Reviewer-Namen/Avatar: `profiles_select_own_or_admin`
// (supabase/migrations/20260804122714_profiles.sql) erlaubt normalen Nutzern ausschließlich das Lesen
// des eigenen Profils — die Identität anderer Reviewer ist über die bestehende RLS-Architektur nicht
// abrufbar, ohne eine neue, hier nicht beauftragte Architekturentscheidung (z. B. öffentliche View)
// zu treffen. Keine Likes/Diskussionsfunktionen (explizit nicht beauftragt).
type ReviewListItemProps = {
  rating: number;
  commentText: string | null;
  createdAt: string;
};

export function ReviewListItem({ rating, commentText, createdAt }: ReviewListItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StarRating rating={rating} />
        <Text style={styles.date}>{formatRelativeTime(createdAt)}</Text>
      </View>
      {commentText ? <Text style={styles.comment}>{commentText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
  comment: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
  },
});
