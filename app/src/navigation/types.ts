// Navigationstypen für den AuthNavigator (siehe docs/Architecture.md Kapitel 7). Weitere Stacks
// (Main, Tabs, Drawer) erhalten eigene Param-Lists, sobald die jeweiligen Features entstehen.
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Haupt-App-Stack (siehe docs/Architecture.md Kapitel 7). `LocationDetail`/`EventDetail`/`ArtistDetail`
// sind laut docs/DesignSystem.md Kapitel 17 eigene Stack-Screens (kein Modal/Bottom-Sheet). Die
// endgültige 5-Tab-Bottom-Navigation mit zentralem Community-Report-Schnellzugriff und Hamburger-Menü
// (docs/Architecture.md Kapitel 7, docs/PRD.md Kapitel 11) entsteht erst mit den übrigen Tab-/
// Menü-Screens — `Map`, `Favorites`, `Profile`, `CommunityReport` und `Settings` sind hier als weitere
// Stack-Screens verdrahtet, nicht als Tab/Menüpunkt; `Favorites`/`Profile`/`CommunityReport`/`Settings`
// haben (anders als die Detail-Screens) noch keinen Einstiegspunkt aus der übrigen Navigation (der wäre
// Teil des noch nicht umgesetzten zentralen Schnellzugriff-Buttons bzw. Hamburger-Menüs), sind aber
// bereits als eigenständige Routen erreichbar. `ChangePassword` und `Permissions` sind Unterseiten von
// `Settings` (Konto → Passwort ändern, Datenschutz → Berechtigungen).
export type MainStackParamList = {
  Main: undefined;
  Map: undefined;
  Favorites: undefined;
  Profile: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  Permissions: undefined;
  CommunityReport: { locationId: string };
  LocationDetail: { locationId: string };
  EventDetail: { eventId: string };
  ArtistDetail: { artistId: string };
};
