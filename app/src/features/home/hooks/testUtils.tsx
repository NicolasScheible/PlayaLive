import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Gemeinsamer Test-Wrapper für alle Home-Dashboard-Hook-Tests (kein Test selbst, daher kein
// `.test.ts(x)`-Suffix, analog zu src/services/testUtils.ts). `retry: false` verhindert, dass
// fehlschlagende Queries in Tests wiederholt werden und Timeouts verursachen; `gcTime: 0` räumt
// abgeschlossene Queries sofort auf, statt Cache-Timer über das Testende hinaus laufen zu lassen.
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}
