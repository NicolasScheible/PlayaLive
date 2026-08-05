import type { NavigatorScreenParams } from '@react-navigation/native';

import type { ReviewTargetType } from '../types/entities';

// Navigationstypen für den AuthNavigator (siehe docs/Architecture.md Kapitel 7). Weitere Stacks
// (Main, Tabs, Drawer) erhalten eigene Param-Lists, sobald die jeweiligen Features entstehen.
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Finaler Drawer/Hamburger-Menü (docs/Architecture.md Kapitel 7: „Umsetzung über den offiziellen
// React-Navigation-Drawer", docs/PRD.md Kapitel 11), verschachtelt im `MainStackParamList`-Eintrag
// `Main`. Enthält ausschließlich die im Auftrag genannten fünf Einträge — Community Report ist
// bewusst NICHT Teil des Drawers, bleibt aber als eigenständige `MainStackParamList`-Route erreichbar
// (siehe `MainDrawerNavigator.tsx`).
export type MainDrawerParamList = {
  Home: undefined;
  Map: undefined;
  Favorites: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Haupt-App-Stack (siehe docs/Architecture.md Kapitel 7). `LocationDetail`/`EventDetail`/`ArtistDetail`
// sind laut docs/DesignSystem.md Kapitel 17 eigene Stack-Screens (kein Modal/Bottom-Sheet). `Main`
// rendert seit der finalen Drawer-Navigation den `MainDrawerNavigator` (Home/Live Map/Favoriten/
// Profil/Einstellungen) statt direkt `HomeScreen` — `Map`/`Favorites`/`Profile`/`Settings` sind daher
// keine Stack-Routen mehr, sondern Screens des verschachtelten Drawers (`MainDrawerParamList`).
// `CommunityReport` bleibt bewusst außerhalb des Drawers, weiterhin nur programmatisch erreichbar
// (kein Einstiegspunkt Teil dieses Schritts). `ChangePassword` und `Permissions` sind Unterseiten von
// `Settings` (Konto → Passwort ändern, Datenschutz → Berechtigungen) und bleiben auf dieser
// Stack-Ebene — aus dem Drawer heraus über die automatische Routenauflösung von React Navigation an
// übergeordnete Navigatoren erreichbar (kein manuelles `getParent()` nötig).
export type MainStackParamList = {
  Main: NavigatorScreenParams<MainDrawerParamList> | undefined;
  ChangePassword: undefined;
  Permissions: undefined;
  CommunityReport: { locationId: string };
  LocationDetail: { locationId: string };
  EventDetail: { eventId: string };
  ArtistDetail: { artistId: string };
  ReviewForm: {
    targetType: ReviewTargetType;
    targetId: string;
    review?: { id: string; rating: number; commentText: string | null };
  };
  Search: undefined;
};
