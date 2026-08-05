import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
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
// Hook (`useLocationReviews`). Erstellen/Bearbeiten/Löschen/Melden (Auftrag Punkt 1–4): eigene Review
// erhält „Bearbeiten"/„Löschen" statt „Melden" — Aktionen als Text-Links unter der jeweiligen Zeile,
// analog zur bestehenden schlichten Listenzeile ohne zusätzliche Card-Optik.
type LocationReviewsSectionProps = {
  averageRating: number | null;
  reviewCount: number;
  reviews: Review[];
  ownReview: Review | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
  onPressCreate: () => void;
  onPressEdit: (review: Review) => void;
  onPressDelete: (review: Review) => void;
  onPressFlag: (review: Review) => void;
};

export function LocationReviewsSection({
  averageRating,
  reviewCount,
  reviews,
  ownReview,
  isLoading,
  isError,
  error,
  onPressCreate,
  onPressEdit,
  onPressDelete,
  onPressFlag,
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
        <View style={styles.padded}>
          <EmptyState message="Noch keine Bewertungen." />
          <Button label="Bewertung abgeben" variant="secondary" onPress={onPressCreate} />
        </View>
      ) : (
        <View style={styles.padded}>
          <View style={styles.summary}>
            <StarRating rating={averageRating} size={20} />
            <Text style={styles.summaryText}>
              {averageRating.toFixed(1)} ({reviewCount} Bewertung{reviewCount === 1 ? '' : 'en'})
            </Text>
          </View>
          {!ownReview ? (
            <View style={styles.createButton}>
              <Button label="Bewertung abgeben" variant="secondary" onPress={onPressCreate} />
            </View>
          ) : null}
          {reviews.map((review) => {
            const isOwnReview = review.id === ownReview?.id;

            return (
              <View key={review.id}>
                <ReviewListItem
                  rating={review.rating}
                  commentText={review.comment_text}
                  createdAt={review.created_at}
                />
                <View style={styles.actions}>
                  {isOwnReview ? (
                    <>
                      <Pressable accessibilityRole="button" onPress={() => onPressEdit(review)}>
                        <Text style={styles.actionText}>Bearbeiten</Text>
                      </Pressable>
                      <Pressable accessibilityRole="button" onPress={() => onPressDelete(review)}>
                        <Text style={styles.actionText}>Löschen</Text>
                      </Pressable>
                    </>
                  ) : (
                    <Pressable accessibilityRole="button" onPress={() => onPressFlag(review)}>
                      <Text style={styles.actionText}>Melden</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  padded: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  summaryText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  createButton: {
    alignItems: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  actionText: {
    color: theme.colors.brand.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.label.fontWeight,
  },
});
