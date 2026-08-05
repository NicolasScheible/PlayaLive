import { useAuthStore } from '../../../store/authStore';

// Auftrag Punkt 9 „Performance: Settings möglichst lokal laden, keine unnötigen Requests" — die
// Session (inkl. E-Mail und E-Mail-Bestätigungsstatus) liegt bereits vollständig im bestehenden
// `authStore` (Zustand, siehe docs/ADR/001-State-Management.md), der beim App-Start einmalig befüllt
// und über `onAuthStateChange` aktuell gehalten wird — kein zusätzlicher Request nötig, kein neuer
// AuthService-Aufruf. „E-Mail-Verifizierung anzeigen" (Konto-Bereich) liest ausschließlich
// `session.user.email_confirmed_at`, ein bereits von Supabase geliefertes Feld.
export function useSettingsScreen() {
  const session = useAuthStore((state) => state.session);

  return {
    email: session?.user.email ?? null,
    isEmailVerified: session?.user.email_confirmed_at !== undefined,
  };
}
