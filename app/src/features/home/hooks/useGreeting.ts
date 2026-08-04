import { useQuery } from '@tanstack/react-query';

import { AuthService } from '../../../services/AuthService';

// Begrüßung gemäß docs/PRD.md Kapitel 10 (Home: „Begrüßung") — Tageszeit-abhängiger Gruß kombiniert
// mit dem Anzeigenamen aus dem Profil (AuthService.getProfile(), bereits bestehender Service). Ein
// Fehlschlagen des Profil-Ladens wird bewusst NICHT als Section-Fehler behandelt (kein ErrorState),
// sondern degradiert auf einen namenlosen Gruß — die Begrüßung ist kein kritischer Inhalt, ein
// Fehlerblock ganz oben auf dem Dashboard wäre unverhältnismäßig.
function greetingForHour(hour: number): string {
  if (hour < 5) return 'Gute Nacht';
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Guten Tag';

  return 'Guten Abend';
}

export function useGreeting() {
  const query = useQuery({
    queryKey: ['home', 'profile'],
    queryFn: () => AuthService.getProfile(),
  });

  return {
    greeting: greetingForHour(new Date().getHours()),
    displayName: query.data?.display_name ?? null,
    isLoading: query.isLoading,
  };
}
