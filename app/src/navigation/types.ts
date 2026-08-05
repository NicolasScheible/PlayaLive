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
// Menü-Screens (Settings) — `Map`, `Favorites`, `Profile` und `CommunityReport` sind hier als weitere
// Stack-Screens verdrahtet, nicht als Tab/Menüpunkt; `Favorites`/`Profile`/`CommunityReport` haben
// (anders als die Detail-Screens) noch keinen Einstiegspunkt aus der übrigen Navigation (der wäre Teil
// des noch nicht umgesetzten zentralen Schnellzugriff-Buttons bzw. Hamburger-Menüs), sind aber bereits
// als eigenständige Routen erreichbar.
export type MainStackParamList = {
  Main: undefined;
  Map: undefined;
  Favorites: undefined;
  Profile: undefined;
  CommunityReport: { locationId: string };
  LocationDetail: { locationId: string };
  EventDetail: { eventId: string };
  ArtistDetail: { artistId: string };
};
