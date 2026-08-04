// Navigationstypen für den AuthNavigator (siehe docs/Architecture.md Kapitel 7). Weitere Stacks
// (Main, Tabs, Drawer) erhalten eigene Param-Lists, sobald die jeweiligen Features entstehen.
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Haupt-App-Stack (siehe docs/Architecture.md Kapitel 7). `LocationDetail` ist laut
// docs/DesignSystem.md Kapitel 17 ein eigener Stack-Screen (kein Modal/Bottom-Sheet) — hier zunächst
// als vorgesehenes Routing-Ziel für den „Details"-Button des Live-Map-Bottom-Sheets, der eigentliche
// Location-Detail-Screen (Reviews, Happy Hours, ...) ist nicht Teil des Live-Map-Auftrags. Die
// endgültige 5-Tab-Bottom-Navigation (docs/Architecture.md Kapitel 7) entsteht erst mit den übrigen
// Tab-Screens (Events, Profile) — `Map` ist hier als weiterer Stack-Screen verdrahtet, nicht als Tab.
export type MainStackParamList = {
  Main: undefined;
  Map: undefined;
  LocationDetail: { locationId: string };
};
