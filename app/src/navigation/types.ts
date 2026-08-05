// Navigationstypen für den AuthNavigator (siehe docs/Architecture.md Kapitel 7). Weitere Stacks
// (Main, Tabs, Drawer) erhalten eigene Param-Lists, sobald die jeweiligen Features entstehen.
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Haupt-App-Stack (siehe docs/Architecture.md Kapitel 7). `LocationDetail`/`EventDetail`/`ArtistDetail`
// sind laut docs/DesignSystem.md Kapitel 17 eigene Stack-Screens (kein Modal/Bottom-Sheet). Die
// endgültige 5-Tab-Bottom-Navigation mit Hamburger-Menü (docs/Architecture.md Kapitel 7,
// docs/PRD.md Kapitel 11) entsteht erst mit den übrigen Tab-/Menü-Screens (Profile, Settings) — `Map`
// und `Favorites` sind hier als weitere Stack-Screens verdrahtet, nicht als Tab/Menüpunkt; `Favorites`
// hat (anders als die Detail-Screens) noch keinen Einstiegspunkt aus der übrigen Navigation (der wäre
// Teil des noch nicht umgesetzten Hamburger-Menüs), ist aber bereits als eigenständige Route erreichbar.
export type MainStackParamList = {
  Main: undefined;
  Map: undefined;
  Favorites: undefined;
  LocationDetail: { locationId: string };
  EventDetail: { eventId: string };
  ArtistDetail: { artistId: string };
};
