import { colors } from './colors';

// Zentraler Theme-Zugriffspunkt gemäß docs/DesignSystem.md. PlayaLive verwendet ausschließlich Dark
// Mode (siehe docs/Design.md „Dark Mode / Light Mode") — es gibt kein zweites Farbschema und damit auch
// keine Laufzeit-Umschaltung; ein statisches Theme-Objekt genügt.
export const theme = {
  colorScheme: 'dark',
  colors,
} as const;

export type Theme = typeof theme;
