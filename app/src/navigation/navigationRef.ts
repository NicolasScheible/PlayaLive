import { createNavigationContainerRef } from '@react-navigation/native';

import type { MainStackParamList } from './types';

// Globale Referenz auf den Navigations-Container (React-Navigation-Standardmuster, um von außerhalb der
// Komponentenhierarchie zu navigieren — hier: aus dem Push-Notification-Feature heraus, wenn eine
// Notification im Hintergrund/aus dem beendeten Zustand angetippt wird, siehe
// `features/notifications/hooks/useNotificationListeners.ts`). Bewusst nur gegen `MainStackParamList`
// typisiert: Detail-Screens (Location/Event/Artist) existieren ausschließlich dort, personalisierte
// Push-Benachrichtigungen setzen ohnehin eine angemeldete Session voraus.
export const navigationRef = createNavigationContainerRef<MainStackParamList>();
