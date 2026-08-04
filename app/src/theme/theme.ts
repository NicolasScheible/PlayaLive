import { colors } from './colors';

// Zentraler Theme-Zugriffspunkt gemäß docs/DesignSystem.md. PlayaLive verwendet ausschließlich Dark
// Mode (siehe docs/Design.md „Dark Mode / Light Mode") — es gibt kein zweites Farbschema und damit auch
// keine Laufzeit-Umschaltung; ein statisches Theme-Objekt genügt.
//
// 🔴 Provisorisch, noch KEINE offizielle DesignSystem.md-Entscheidung: `spacing`, `radius.pill` und
// `typography` sind in docs/DesignSystem.md Kapitel 4/5/7 ausdrücklich als offene Designentscheidungen
// markiert (exakte px/pt-Werte aus den Mockup-Standbildern nicht messbar). Die Werte hier sind ein
// Standard-8pt-Raster als Platzhalter, damit Screens überhaupt lauffähig sind — ausschließlich über
// dieses Modul referenziert, damit sie an einer einzigen Stelle ersetzt werden können, sobald der
// Product Owner die echten Werte bestätigt. `text.secondary`/`border.subtle` sind Opazitäts-Ableitungen
// der bereits entschiedenen Farbe `colors.text.primary`, keine neuen Hex-Werte (vgl. Kapitel 3: „exakter
// Hex-Wert für sekundäre/gedämpfte Textfarbe" ebenfalls offen).
export const theme = {
  colorScheme: 'dark',
  colors: {
    ...colors,
    text: {
      ...colors.text,
      secondary: 'rgba(255, 255, 255, 0.6)',
    },
    border: {
      subtle: 'rgba(255, 255, 255, 0.15)',
    },
    // Dunkles Verlaufs-/Scrim-Overlay für Bild-Cards (Kapitel 12: „dunkles Verlaufs-Overlay am unteren
    // Bildrand, damit darüberliegender weißer Text lesbar bleibt") sowie Badge-Hintergründe auf Bildern
    // — Opazitäts-Ableitung von Schwarz, kein neuer Marken-/Statuswert.
    overlay: {
      scrim: 'rgba(0, 0, 0, 0.4)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    pill: 999,
    // 🔴 Provisorisch (siehe Kommentar oben): Kapitel 7 verlangt „großzügig abgerundete" Cards/Bilder,
    // ohne exakten px/pt-Wert. `card` als deutlich sichtbarer, aber nicht vollständig ovaler Radius.
    card: 20,
  },
  typography: {
    // Kapitel 4, Hierarchiestufe 1: „Große, fette Zahlen/Headlines für zentrale Werte (z. B.
    // Temperatur „28°", Auslastung „85%", Countdown-Timer)" — deutlich größer als `title`.
    hero: { fontSize: 40, fontWeight: '700' },
    title: { fontSize: 24, fontWeight: '700' },
    body: { fontSize: 16, fontWeight: '400' },
    label: { fontSize: 14, fontWeight: '600' },
    caption: { fontSize: 12, fontWeight: '400' },
  },
} as const;

export type Theme = typeof theme;
