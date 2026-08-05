import 'react-native-gesture-handler/jestSetup';

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
