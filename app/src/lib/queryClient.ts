import { QueryClient } from '@tanstack/react-query';

// Zentrale TanStack-Query-Instanz für Server State (siehe docs/ADR/001-State-Management.md).
// Konkrete Query-Optionen (staleTime, retry-Verhalten je Domäne) folgen mit den jeweiligen Services.
export const queryClient = new QueryClient();
