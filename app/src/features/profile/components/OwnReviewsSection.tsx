import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { ReviewListItem } from '../../../components/ReviewListItem';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import type { AppError } from '../../../lib/errors';
import { theme } from '../../../theme/theme';
import type { OwnReviewWithTargetName } from '../hooks/useOwnReviews';

const SKELETON_ROW_HEIGHT = 64;
const SKELETON_COUNT = 2;

// Eigene Reviews gemäß Auftrag Punkt 4: Liste, Klick navigiert zur jeweiligen Location/zum jeweiligen
// Artist (bestehende Detail-Screens). Bestehendes `ReviewListItem` unverändert wiederverwendet (CLAUDE.md:
// „kein Refactoring funktionierenden Codes"), Zielname + Klick-Handling über einen umgebenden `Pressable`
// analog zu `EventArtistsSection.tsx`. Vertikale Liste (docs/DesignSystem.md Kapitel 6: „vollständige
// Übersichten" sind einspaltig), da dies — anders als die Detail-Screen-Sections — die Hauptliste des
// Profil-Screens ist, nicht ein kuratiertes Karussell.
type OwnReviewsSectionProps = {
  reviews: OwnReviewWithTargetName[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onPressReview: (review: OwnReviewWithTargetName) => void;
};

export function OwnReviewsSection({
  reviews,
  isLoading,
  isError,
  error,
  onPressReview,
}: OwnReviewsSectionProps) {
  return (
    <>
      <SectionHeader title="Eigene Bewertungen" />
      {isLoading ? (
        <View style={styles.list} accessibilityLabel="Eigene Bewertungen werden geladen">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <SkeletonBlock key={index} width="100%" height={SKELETON_ROW_HEIGHT} />
          ))}
        </View>
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Bewertungen konnten nicht geladen werden.'} />
      ) : reviews.length === 0 ? (
        <EmptyState message="Du hast noch keine Bewertungen abgegeben." />
      ) : (
        <View style={styles.list}>
          {reviews.map((review) => (
            <Pressable
              key={review.id}
              onPress={() => onPressReview(review)}
              accessibilityRole="button"
            >
              <Text style={styles.targetName}>{review.targetName}</Text>
              <ReviewListItem
                rating={review.rating}
                commentText={review.comment_text}
                createdAt={review.created_at}
              />
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  targetName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
});
