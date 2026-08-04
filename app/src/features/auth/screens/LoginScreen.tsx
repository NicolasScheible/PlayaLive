import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import type { AuthStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  function handleSubmit() {
    if (!isValidEmail(email)) {
      setEmailError('Bitte gib eine gültige E-Mail-Adresse ein.');

      return;
    }

    setEmailError(undefined);
    login(email, password);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Deine Playa. Live dabei.</Text>

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
          <TextField
            label="Passwort"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
          />

          {error ? <Text style={styles.errorText}>{error.message}</Text> : null}

          <Button label="Login" onPress={handleSubmit} loading={loading} />

          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>Passwort vergessen?</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.secondaryText}>
            Noch kein Konto? <Text style={styles.link}>Registrieren</Text>
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
