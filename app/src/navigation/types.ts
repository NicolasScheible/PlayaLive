// Navigationstypen für den AuthNavigator (siehe docs/Architecture.md Kapitel 7). Weitere Stacks
// (Main, Tabs, Drawer) erhalten eigene Param-Lists, sobald die jeweiligen Features entstehen.
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Haupt-App-Stack (siehe docs/Architecture.md Kapitel 7). `LocationDetail`/`EventDetail` sind laut
// docs/DesignSystem.md Kapitel 17 eigene Stack-Screens (kein Modal/Bottom-Sheet). `EventDetail` ist
// vorerst ein Platzhalter (Navigationsziel für die „Heutige Events"-Vorschau auf Location Detail, siehe
// features/events/screens/EventDetailScreen.tsx) — der eigentliche Event-Detail-Screen ist nicht Teil
// des Location-Detail-Auftrags. Die endgültige 5-Tab-Bottom-Navigation (docs/Architecture.md Kapitel 7)
// entsteht erst mit den übrigen Tab-Screens (Events, Profile) — `Map` ist hier als weiterer
// Stack-Screen verdrahtet, nicht als Tab.
export type MainStackParamList = {
  Main: undefined;
  Map: undefined;
  LocationDetail: { locationId: string };
  EventDetail: { eventId: string };
};
