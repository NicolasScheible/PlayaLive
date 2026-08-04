import { useQuery } from '@tanstack/react-query';

import type { AppError } from '../../../lib/errors';
import { LocationService } from '../../../services/LocationService';
import type { Location } from '../../../types/entities';

// Geteilte Grundlage für mehrere Home-Sections (Live-Auslastung, Aktuelle Acts, Nächster Act, Happy
// Hours, Specials benötigen alle Location-Namen). Ein eigener Hook statt eines direkten
// `LocationService`-Aufrufs je Section-Hook, damit TanStack Query den Request unter demselben
// Query-Key (`['home', 'locations']`) über alle aufrufenden Hooks hinweg dedupliziert/cached — ein
// einziger Netzwerk-Request statt eines je Section.
export function useLocations() {
  return useQuery<Location[], AppError>({
    queryKey: ['home', 'locations'],
    queryFn: () => LocationService.getLocations(),
  });
}
