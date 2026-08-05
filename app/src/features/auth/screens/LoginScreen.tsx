import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import type { AuthStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useAppleSignIn } from '../hooks/useAppleSignIn';
import { useAuth } from '../hooks/useAuth';
import { useGoogleSignIn } from '../hooks/useGoogleSignIn';
import { isValidEmail } from '../validation/authValidation';

// Apple/Google Sign-In (docs/PRD.md Kapitel 12) ergänzen ausschließlich den bestehenden Login-Screen —
// beide Verfahren legen bei Erstanmeldung automatisch ein Konto an (Supabase `signInWithIdToken`),
// daher genügt EIN Einstiegspunkt hier statt zusätzlicher Buttons auf dem separaten
// `RegisterScreen` (der nur für den E-Mail/Passwort-Weg zwei getrennte Screens vorsieht).
const APPLE_BUTTON_HEIGHT = 48;

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { login, loading, error } = useAuth();
  const appleSignIn = useAppleSignIn();
  const googleSignIn = useGoogleSignIn();
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

  const socialError = appleSignIn.error ?? googleSignIn.error;

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

        {appleSignIn.isAvailable || googleSignIn.isConfigured ? (
          <View style={styles.socialSection}>
            <Text style={styles.divider}>oder</Text>

            {socialError ? <Text style={styles.errorText}>{socialError.message}</Text> : null}

            {appleSignIn.isAvailable ? (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                cornerRadius={theme.radius.pill}
                style={styles.appleButton}
                onPress={appleSignIn.signIn}
              />
            ) : null}

            {googleSignIn.isConfigured ? (
              <GoogleSignInButton onPress={googleSignIn.signIn} loading={googleSignIn.loading} />
            ) : null}
          </View>
        ) : null}

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
  socialSection: {
    gap: theme.spacing.sm,
  },
  divider: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  // Apple verlangt eigene Maße für `AppleAuthenticationButton` (siehe Kommentar in der Komponenten-
  // Dokumentation: „Make sure to attach height and width ... without them the button will not
  // appear"). `APPLE_BUTTON_HEIGHT` ist analog zu `MENU_BUTTON_SIZE` in `Header.tsx` eine lokale,
  // benannte Konstante für eine plattformseitig vorgegebene Mindestgröße, keine Design-Entscheidung.
  appleButton: {
    width: '100%',
    height: APPLE_BUTTON_HEIGHT,
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
