import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import type { MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { ReviewForm } from '../components/ReviewForm';
import { useCreateReview } from '../hooks/useCreateReview';
import { useUpdateReview } from '../hooks/useUpdateReview';

// Review erstellen/bearbeiten (Auftrag Punkt 1/2), orchestriert ausschließlich über Hooks (CLAUDE.md →
// Vorgehensweise: keine Business-Logik/kein Datenzugriff im Screen). Formularzustand direkt im Screen,
// analog zu `ChangePasswordScreen.tsx` — ein Formular dieser Größe braucht keine eigene
// „Screen-Bündel"-Hook. Edit-Modus wird an der Anwesenheit von `route.params.review` erkannt
// (Prefill-Daten kommen direkt aus dem aufrufenden Screen, keine neue „Review per ID laden"-Methode
// nötig). Bei Erfolg direkter Rücksprung (`navigation.goBack()`), analog zu `ChangePasswordScreen.tsx`.
type ReviewFormScreenProps = NativeStackScreenProps<MainStackParamList, 'ReviewForm'>;
type ReviewFormNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ReviewForm'>;

export function ReviewFormScreen({ route }: ReviewFormScreenProps) {
  const navigation = useNavigation<ReviewFormNavigationProp>();
  const { targetType, targetId, review } = route.params;
  const isEditMode = review !== undefined;

  const [rating, setRating] = useState(review?.rating ?? 0);
  const [commentText, setCommentText] = useState(review?.commentText ?? '');
  const [ratingError, setRatingError] = useState<string | undefined>(undefined);

  const create = useCreateReview();
  const update = useUpdateReview();

  const isSubmitting = isEditMode ? update.isSubmitting : create.isSubmitting;
  const isSuccess = isEditMode ? update.isSuccess : create.isSuccess;
  const error = isEditMode ? update.error : create.error;

  useEffect(() => {
    if (isSuccess) {
      navigation.goBack();
    }
  }, [isSuccess, navigation]);

  function handleSubmit() {
    if (rating < 1) {
      setRatingError('Bitte wähle eine Sternebewertung aus.');

      return;
    }

    setRatingError(undefined);

    if (isEditMode) {
      update.updateReview(review.id, targetType, targetId, {
        rating,
        commentText: commentText.trim().length > 0 ? commentText.trim() : undefined,
      });

      return;
    }

    create.createReview({
      targetType,
      targetId,
      rating,
      commentText: commentText.trim().length > 0 ? commentText.trim() : undefined,
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

      <ReviewForm
        rating={rating}
        onChangeRating={setRating}
        commentText={commentText}
        onChangeCommentText={setCommentText}
        ratingError={ratingError}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={isEditMode ? 'Speichern' : 'Bewertung abgeben'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    paddingVertical: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.high,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
});
