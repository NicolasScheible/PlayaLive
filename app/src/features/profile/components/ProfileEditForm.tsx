import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import { theme } from '../../../theme/theme';

// Bearbeitbar gemäß Auftrag Punkt 2: „Anzeigename, Benutzername (falls laut Datenmodell erlaubt)" —
// beides dasselbe Feld (`display_name`, siehe `ProfileHeader.tsx`), daher ein einzelnes Textfeld,
// beschriftet wie im bestehenden `RegisterScreen.tsx` als „Benutzername". E-Mail/Account-ID sind laut
// Auftrag nicht bearbeitbar und daher hier nicht Teil des Formulars. `Button`/`TextField` sind bereits
// bestehende, generische Komponenten (siehe RegisterScreen.tsx) — kein neues Eingabefeld erfunden.
type ProfileEditFormProps = {
  initialUsername: string;
  isSaving: boolean;
  onSave: (username: string) => void;
};

export function ProfileEditForm({ initialUsername, isSaving, onSave }: ProfileEditFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const trimmedUsername = username.trim();

  return (
    <View style={styles.container}>
      <TextField
        label="Benutzername"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoComplete="username"
        textContentType="username"
      />
      <Button
        label="Speichern"
        onPress={() => onSave(trimmedUsername)}
        loading={isSaving}
        disabled={trimmedUsername.length === 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
});
