import 'react-native-gesture-handler/jestSetup';

// Test-Platzhalterwerte, damit src/lib/supabase.ts (System-Boundary-Validierung) in Tests nicht wirft.
// Kein echtes Supabase-Projekt — Tests dürfen keine echten Netzwerkaufrufe an Supabase auslösen.
process.env.EXPO_PUBLIC_SUPABASE_URL ??= 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??= 'test-anon-key';

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
