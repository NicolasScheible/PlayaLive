import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import { theme } from '../../../theme/theme';

// Inhalt des Bottom Sheets zum Melden einer fremden Bewertung (Auftrag Punkt 4), analog zur
// bestehenden Auslagerung von Bottom-Sheet-Inhalten in eine eigene Komponente
// (`LocationBottomSheetContent.tsx`). Rein präsentational: Grund-Textfeld + Absenden-Button, Zustand
// und Absenden liegen im aufrufenden `LocationDetailScreen.tsx`.
type FlagReviewSheetProps = {
  reason: string;
  onChangeReason: (value: string) => void;
  reasonError?: string;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function FlagReviewSheet({
  reason,
  onChangeReason,
  reasonError,
  onSubmit,
  isSubmitting,
}: FlagReviewSheetProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bewertung melden</Text>
      <TextField
        label="Grund"
        value={reason}
        onChangeText={onChangeReason}
        placeholder="Warum meldest du diese Bewertung?"
        multiline
        error={reasonError}
      />
      <Button label="Melden" onPress={onSubmit} loading={isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
});
