import { useEffect, useState } from 'react';

// Geteilter, feature-übergreifender Hook (siehe hooks/README.md) — verzögert Wertänderungen um
// `delayMs`, damit z. B. Live-Suche (features/search/) nicht bei jedem Tastendruck neu filtert/abfragt.
// Reine Zeitsteuerung ohne Datenzugriff, daher hier statt in einem Feature-Modul.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
