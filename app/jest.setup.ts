import 'react-native-gesture-handler/jestSetup';

// Offiziell von React Navigation empfohlener Mock (https://reactnavigation.org/docs/drawer-navigator/
// → „Testing"): `@react-navigation/drawer` lädt beim Import transitiv das native
// Reanimated/Worklets-Modul, das im Jest-Environment nicht registriert ist — ohne diesen Mock würde
// jeder Test, der den neuen `MainDrawerNavigator` importiert, beim Modul-Import abstürzen.
// `react-native-worklets` muss VOR `react-native-reanimated` gemockt werden, da Reanimateds eigener
// Mock (`react-native-reanimated/mock`) den nativen Worklets-Initialisierer sonst selbst noch lädt
// (Reanimated 4 hat die Worklets-Engine in ein eigenes Paket ausgelagert).
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Test-Platzhalterwerte, damit src/lib/supabase.ts (System-Boundary-Validierung) in Tests nicht wirft.
// Kein echtes Supabase-Projekt — Tests dürfen keine echten Netzwerkaufrufe an Supabase auslösen.
process.env.EXPO_PUBLIC_SUPABASE_URL ??= 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= 'test-anon-key';
process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ??= 'test-mapbox-token';

// require() ist hier notwendig, da jest.mock-Factories von babel-plugin-jest-hoist vor alle
// Imports gehoben werden.
jest.mock(
  'react-native-safe-area-context',
  () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Das echte Paket lädt beim Import bereits ein natives Firebase-Modul (`NativeRNFBTurboApp`), das im
// Jest-Environment nicht registriert ist — jeder Test, der transitiv `NotificationService.ts`
// importiert (z. B. App.test.tsx), würde sonst beim Modul-Import abstürzen. Globaler Low-Effort-Mock
// hier; `NotificationService.test.ts` überschreibt ihn lokal mit spezifischen Spies.
// Analog zur Firebase-Messaging-Begründung oben: `LoginScreen.tsx` importiert seit Apple/Google
// Sign-In `expo-apple-authentication`/`expo-auth-session`/`expo-web-browser`/`expo-crypto` — native
// Module, die im Jest-Environment nicht registriert sind. `App.test.tsx` rendert `LoginScreen` über die
// echte, ungemockte Navigation (kein direkter Import), daher hier ein globaler Low-Effort-Mock, der
// Apple/Google standardmäßig als „nicht verfügbar"/„nicht konfiguriert" meldet (kein Button sichtbar).
// `useAppleSignIn.test.ts`/`useGoogleSignIn.test.ts`/`LoginScreen.test.tsx` überschreiben ihn lokal mit
// spezifischen Verhalten, genau wie bei `NotificationService.test.ts`.
jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(false),
  signInAsync: jest.fn(),
  AppleAuthenticationButton: () => null,
  AppleAuthenticationButtonType: { SIGN_IN: 0, CONTINUE: 1, SIGN_UP: 2 },
  AppleAuthenticationButtonStyle: { WHITE: 0, WHITE_OUTLINE: 1, BLACK: 2 },
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useIdTokenAuthRequest: jest.fn(() => [null, null, jest.fn()]),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

// `AuthService.ts`/`useAuthDeepLink.ts` importieren `expo-linking` für den E-Mail-Bestätigungslink
// (siehe docs/ADR/002-Authentication.md). `createURL` liefert hier deterministisch dieselbe
// `playalive://`-URL wie im echten Build (siehe AUTH_CALLBACK_URL in AuthService.ts), ohne das native
// Modul zu laden. `AuthService.test.ts`/`useAuthDeepLink.test.ts` überschreiben `getInitialURL`/
// `addEventListener` lokal mit spezifischem Verhalten, analog zu den übrigen Mocks in dieser Datei.
jest.mock('expo-linking', () => ({
  createURL: jest.fn((path: string) => `playalive://${path}`),
  getInitialURL: jest.fn().mockResolvedValue(null),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('expo-crypto', () => ({
  randomUUID: jest.fn(() => 'test-nonce'),
  digestStringAsync: jest.fn().mockResolvedValue('test-hashed-nonce'),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

jest.mock('@react-native-firebase/messaging', () => ({
  AuthorizationStatus: {
    NOT_DETERMINED: -1,
    DENIED: 0,
    AUTHORIZED: 1,
    PROVISIONAL: 2,
    EPHEMERAL: 3,
  },
  getMessaging: jest.fn(() => 'messaging-instance'),
  getToken: jest.fn(() => Promise.resolve('test-fcm-token')),
  hasPermission: jest.fn(() => Promise.resolve(-1)),
  requestPermission: jest.fn(() => Promise.resolve(-1)),
  onMessage: jest.fn(() => () => undefined),
  onNotificationOpenedApp: jest.fn(() => () => undefined),
  onTokenRefresh: jest.fn(() => () => undefined),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  setBackgroundMessageHandler: jest.fn(),
}));
