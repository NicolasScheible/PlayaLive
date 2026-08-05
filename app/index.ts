import { registerRootComponent } from 'expo';

import App from './src/App';
import { NotificationService } from './src/services/NotificationService';

// Muss außerhalb des React-Lifecycles registriert werden (Firebase-Vorgabe für Background-/
// Quit-State-Notifications, docs/ADR/007-Notifications.md) — daher hier statt in App.tsx.
NotificationService.registerBackgroundHandler();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
