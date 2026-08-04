import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '../features/auth/screens/ForgotPasswordScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { theme } from '../theme/theme';

import type { AuthStackParamList } from './types';

// Login-/Registrierungs-Flow (Apple Sign-In, Google Sign-In, E-Mail & Passwort — siehe
// docs/PRD.md Kapitel 12, docs/ADR/002-Authentication.md). Login ist ab v1.0 verpflichtend, es gibt
// keinen Gastmodus — dieser Navigator wird gerendert, solange keine Session besteht. In diesem
// Ausbauschritt ist ausschließlich E-Mail & Passwort umgesetzt (siehe Zusammenfassung).
const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background.base },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
