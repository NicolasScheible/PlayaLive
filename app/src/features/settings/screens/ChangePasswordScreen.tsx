import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import { theme } from '../../../theme/theme';
import { useChangePassword } from '../hooks/useChangePassword';
import {
  PASSWORD_MIN_LENGTH,
  isValidPassword,
  passwordsMatch,
} from '../validation/changePasswordValidation';

// Settings → Konto → „Passwort ändern". Formularaufbau 1:1 nach dem bestehenden Muster aus
// `RegisterScreen.tsx` (Button/TextField, lokale Feldfehler, Validierung vor dem Absenden) — keine
// neue Formular-/Validierungs-Architektur. Bei Erfolg direkter Rücksprung, kein neuer
// Erfolgs-Dialog-Mechanismus (Auftrag verlangt einen Erfolgsdialog nur für den Community-Report-Flow).
export function ChangePasswordScreen() {
  const navigation = useNavigation();
  const { changePassword, isSaving, error } = useChangePassword();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    passwordConfirmation?: string;
  }>({});

  async function handleSubmit() {
    const nextFieldErrors: typeof fieldErrors = {};

    if (!isValidPassword(password)) {
      nextFieldErrors.password = `Das Passwort muss mindestens ${PASSWORD_MIN_LENGTH} Zeichen lang sein.`;
    }

    if (!passwordsMatch(password, passwordConfirmation)) {
      nextFieldErrors.passwordConfirmation = 'Die Passwörter stimmen nicht überein.';
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    try {
      await changePassword(password);
      navigation.goBack();
    } catch {
      // Fehler wird über `error` aus `useChangePassword` angezeigt.
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.form}>
        <TextField
          label="Neues Passwort"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          textContentType="newPassword"
          error={fieldErrors.password}
        />
        <TextField
          label="Neues Passwort wiederholen"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          textContentType="newPassword"
          error={fieldErrors.passwordConfirmation}
        />

        {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

        <Button label="Passwort ändern" onPress={handleSubmit} loading={isSaving} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  form: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.high,
    textAlign: 'center',
  },
});
