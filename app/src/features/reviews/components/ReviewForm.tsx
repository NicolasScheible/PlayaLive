import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { StarRating } from '../../../components/StarRating';
import { TextField } from '../../../components/TextField';
import { theme } from '../../../theme/theme';

// Formular für Review erstellen/bearbeiten (Auftrag Punkt 1/2), rein präsentational — Formularzustand
// und Absenden liegen im aufrufenden `ReviewFormScreen` (analog zu `ChangePasswordScreen.tsx`: lokaler
// Formularzustand direkt im Screen für ein Formular dieser Größe, keine eigene „Screen-Bündel"-Hook
// nötig). Sternebewertung über die um `onChange` erweiterte `StarRating`-Komponente, Kommentar über die
// um `multiline` erweiterte `TextField`-Komponente — beide bestehende, generische Bausteine.
type ReviewFormProps = {
  rating: number;
  onChangeRating: (value: number) => void;
  commentText: string;
  onChangeCommentText: (value: string) => void;
  ratingError?: string;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
};

export function ReviewForm({
  rating,
  onChangeRating,
  commentText,
  onChangeCommentText,
  ratingError,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ReviewFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.ratingSection}>
        <Text style={styles.label}>Deine Bewertung</Text>
        <StarRating rating={rating} size={32} onChange={onChangeRating} />
        {ratingError ? <Text style={styles.errorText}>{ratingError}</Text> : null}
      </View>

      <TextField
        label="Kommentar (optional)"
        value={commentText}
        onChangeText={onChangeCommentText}
        placeholder="Wie war dein Erlebnis?"
        multiline
      />

      <Button label={submitLabel} onPress={onSubmit} loading={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  ratingSection: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    color: theme.colors.text.primary,
  },
  errorText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.high,
  },
});
