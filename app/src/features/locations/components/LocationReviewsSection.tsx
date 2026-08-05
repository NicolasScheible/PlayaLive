import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { ReviewListItem } from '../../../components/ReviewListItem';
import { SectionHeader } from '../../../components/SectionHeader';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import { StarRating } from '../../../components/StarRating';
import type { AppError } from '../../../lib/errors';
import { theme } from '../../../theme/theme';
import type { Review } from '../../../types/entities';

// Bewertungen gemäß Auftrag Punkt 7: „Durchschnittsbewertung, Anzahl Bewertungen, Liste der Reviews ...
// Review-Komponente entsprechend dem DesignSystem. Keine Likes oder Diskussionsfunktionen." Vertikale
// Liste mit Trennlinien statt horizontalem Karussell (docs/DesignSystem.md Kapitel 18 „Kompakte
// Listenzeile ... durch dünne Trennlinien/Abstand statt Cards getrennt" — passender als das
// Card-Karussell-Muster für textlastige Bewertungen). Durchschnitt/Anzahl kommen bereits berechnet vom
// Hook (`useLocationReviews`).
type LocationReviewsSectionProps = {
  averageRating: number | null;
  reviewCount: number;
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function LocationReviewsSection({
  averageRating,
  reviewCount,
  reviews,
  isLoading,
  isError,
  error,
}: LocationReviewsSectionProps) {
  return (
    <>
      <SectionHeader title="Bewertungen" />
      {isLoading ? (
        <View style={styles.padded}>
          <SkeletonBlock width={200} height={60} />
        </View>
      ) : isError ? (
        <ErrorState message={error?.message ?? 'Bewertungen konnten nicht geladen werden.'} />
      ) : reviewCount === 0 || averageRating === null ? (
        <EmptyState message="Noch keine Bewertungen." />
      ) : (
        <View style={styles.padded}>
          <View style={styles.summary}>
            <StarRating rating={averageRating} size={20} />
            <Text style={styles.summaryText}>
              {averageRating.toFixed(1)} ({reviewCount} Bewertung{reviewCount === 1 ? '' : 'en'})
            </Text>
          </View>
          {reviews.map((review) => (
            <ReviewListItem
              key={review.id}
              rating={review.rating}
              commentText={review.comment_text}
              createdAt={review.created_at}
            />
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: theme.spacing.md,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  summaryText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
});
