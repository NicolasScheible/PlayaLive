import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import type { AuthStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { useAuth } from '../hooks/useAuth';
import {
  PASSWORD_MIN_LENGTH,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from '../validation/authValidation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { register, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    passwordConfirmation?: string;
  }>({});

  async function handleSubmit() {
    const nextFieldErrors: typeof fieldErrors = {};

    if (!isValidEmail(email)) {
      nextFieldErrors.email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
    }

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

    const success = await register({ username, email, password });

    // Nach ADR-002 ist die App sofort nutzbar — der bestehende `onAuthStateChange`-Listener im
    // `authStore` übernimmt die neue (zunächst anonyme) Session automatisch, der RootNavigator
    // wechselt daraufhin selbstständig in die Haupt-App (siehe RootNavigator.tsx). Ein eigener
    // Erfolgs-Screen hier würde also in der Praxis nie sichtbar, da diese Komponente durch den
    // Navigator-Wechsel bereits unmountet sein kann, bevor React erneut rendert — `Alert.alert` ist
    // davon als imperativer, nicht an den Component-Lifecycle gebundener Aufruf unabhängig.
    if (success) {
      Alert.alert(
        'Fast geschafft',
        `Wir haben dir eine E-Mail an ${email} geschickt. Bestätige deine Adresse über den Link ` +
          'darin, um Community-Reports und Bewertungen veröffentlichen zu können. PlayaLive kannst ' +
          'du bereits jetzt nutzen.',
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Konto erstellen</Text>

        <View style={styles.form}>
          <TextField
            label="Benutzername"
            value={username}
            onChangeText={setUsername}
            placeholder="Dein Anzeigename"
            autoCapitalize="none"
            autoComplete="username"
            textContentType="username"
          />
          <TextField
            label="E-Mail"
            value={email}
            onChangeText={setEmail}
            placeholder="du@beispiel.de"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={fieldErrors.email}
          />
          <TextField
            label="Passwort"
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
            label="Passwort wiederholen"
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

          <Button label="Registrieren" onPress={handleSubmit} loading={loading} />
        </View>

        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.secondaryText}>
            Schon ein Konto? <Text style={styles.link}>Login</Text>
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
