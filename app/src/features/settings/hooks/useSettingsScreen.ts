import { useAuthStore } from '../../../store/authStore';

// Auftrag Punkt 9 „Performance: Settings möglichst lokal laden, keine unnötigen Requests" — die
// Session (inkl. E-Mail und Verifizierungsstatus) liegt bereits vollständig im bestehenden
// `authStore` (Zustand, siehe docs/ADR/001-State-Management.md), der beim App-Start einmalig befüllt
// und über `onAuthStateChange` aktuell gehalten wird — kein zusätzlicher Request nötig, kein neuer
// AuthService-Aufruf.
//
// „E-Mail-Verifizierung anzeigen" (Konto-Bereich) liest den nativen `is_anonymous`-JWT-Claim statt
// `session.user.email_confirmed_at` (siehe docs/Architecture.md Kapitel 12 „E-Mail-Bestätigung"):
// Registrierung läuft über `AuthService.signUpWithPassword()` zunächst als anonyme Session
// (ADR-002 „sofort nutzbar"), die per `updateUser()` zu einem permanenten Account erweitert wird —
// `is_anonymous` wechselt erst mit dem Klick auf den Bestätigungslink auf `false`. Kein eigenes
// `profiles`-Verifizierungsfeld, um keine parallele Buchführung zum nativen Supabase-Identitätszustand
// aufzubauen.
export function useSettingsScreen() {
  const session = useAuthStore((state) => state.session);

  return {
    email: session?.user.email ?? null,
    isEmailVerified: session != null && session.user.is_anonymous !== true,
  };
}
