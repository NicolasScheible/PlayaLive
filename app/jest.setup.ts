import 'react-native-gesture-handler/jestSetup';

// require() ist hier notwendig, da jest.mock-Factories von babel-plugin-jest-hoist vor alle
// Imports gehoben werden.
jest.mock(
  'react-native-safe-area-context',
  () =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-safe-area-context/jest/mock').default,
);
