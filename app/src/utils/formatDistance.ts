// Formatierung einer Entfernung (Meter) für die Anzeige, z. B. „350 m"/„1.2 km". Zentralisiert ab der
// 3. Verwendung (CLAUDE.md → Code-Qualität „ab 3. Verwendung") — zuvor identisch dupliziert in
// LocationBottomSheetContent.tsx (Live-Karte) und LocationDetailHeader.tsx (Location Detail).
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
}
