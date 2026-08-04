// Formularvalidierung für Login/Registrierung/Passwort-Reset. Rein clientseitige Vorabprüfung —
// verbindlich durchgesetzt wird ausschließlich serverseitig (Supabase Auth), siehe
// docs/Architecture.md Kapitel 17 „Sicherheit": das Frontend entscheidet nie abschließend über
// Gültigkeit/Berechtigungen.
//
// 🔴 Annahme, keine offizielle Entscheidung: Eine Passwort-Mindestlänge ist in docs/PRD.md und
// docs/Architecture.md nirgends festgelegt. Es wird hier der Supabase-Auth-Standardwert (6 Zeichen)
// verwendet — zur Bestätigung durch den Product Owner vorgelegt, nicht stillschweigend als Fakt gesetzt.
export const PASSWORD_MIN_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH;
}

export function passwordsMatch(password: string, passwordConfirmation: string): boolean {
  return password === passwordConfirmation;
}
