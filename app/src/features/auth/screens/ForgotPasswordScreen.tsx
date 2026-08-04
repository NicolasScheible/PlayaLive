import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import type { AuthStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const { resetPassword, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [wasSent, setWasSent] = useState(false);

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      setEmailError('Bitte gib eine gültige E-Mail-Adresse ein.');

      return;
    }

    setEmailError(undefined);
    const success = await resetPassword(email);
    setWasSent(success);
  }

  if (wasSent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>E-Mail unterwegs</Text>
          <Text style={styles.secondaryText}>
            Falls ein Konto zu {email} existiert, haben wir dir eine E-Mail zum Zurücksetzen deines
            Passworts geschickt.
          </Text>
          <Button label="Zurück zum Login" onPress={() => navigation.navigate('Login')} />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Passwort vergessen</Text>
        <Text style={styles.secondaryText}>
          Gib deine E-Mail-Adresse ein — wir schicken dir einen Link zum Zurücksetzen deines
          Passworts.
        </Text>

        <View style={styles.form}>
          <TextField
            label="E-Mail"
            value={email}
            onChangeText={setEmail}
            placeholder="du@beispiel.de"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={emailError}
          />

          {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

          <Button label="Link senden" onPress={handleSubmit} loading={loading} />
        </View>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>
            Zurück zum <Text style={styles.link}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  form: {
    gap: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.high,
    textAlign: 'center',
  },
  link: {
    color: theme.colors.brand.primary,
    fontWeight: theme.typography.label.fontWeight,
  },
  secondaryText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
