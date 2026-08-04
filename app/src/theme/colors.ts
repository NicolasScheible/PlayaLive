// Design-Tokens gemäß docs/DesignSystem.md Kapitel 3 „Farbpalette".
// Enthält ausschließlich Werte, die dort als ✅ entschieden markiert sind. Weitere Tokens (Typografie,
// Spacing, Elevation) folgen erst, sobald die zugehörigen 🔴 offenen Designentscheidungen geklärt sind
// (siehe docs/DesignSystem.md Kapitel 25).
export const colors = {
  background: {
    base: '#070B1A',
  },
  brand: {
    primary: '#F2247A',
  },
  status: {
    low: '#1B7A2E',
    medium: '#F0B80E',
    high: '#E31F27',
  },
  text: {
    primary: '#FFFFFF',
  },
} as const;
