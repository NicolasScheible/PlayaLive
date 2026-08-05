// Clientseitige Vorabvalidierung fürs Passwort-ändern-Formular — rein clientseitige Vorabprüfung,
// verbindlich durchgesetzt wird ausschließlich serverseitig (Supabase Auth), siehe
// docs/Architecture.md Kapitel 17 „Sicherheit". Dieselben Werte/Funktionen wie
// `features/auth/validation/authValidation.ts` (PASSWORD_MIN_LENGTH, passwordsMatch) — hier erneut
// lokal definiert statt cross-feature importiert (features/README.md: „ausschließlich über eigenen
// Service ... nie direkt auf ein anderes Feature-Modul").
//
// 🔴 Wie in `authValidation.ts`: Passwort-Mindestlänge ist in docs/PRD.md/docs/Architecture.md nirgends
// festgelegt — hier der Supabase-Auth-Standardwert (6 Zeichen) übernommen, keine neue Annahme.
export const PASSWORD_MIN_LENGTH = 6;

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}

export function passwordsMatch(password: string, passwordConfirmation: string): boolean {
  return password === passwordConfirmation;
}
