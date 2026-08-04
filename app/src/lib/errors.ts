// Einheitliches Fehlerformat gemäß docs/Architecture.md Kapitel 15 „Fehlerbehandlung"
// (Architekturentscheidung 9). `messageKey` ist als i18n-Schlüssel vorgesehen; da die konkrete
// i18n-Bibliothek noch offen ist (docs/Architecture.md Kapitel 25, Punkt 6), lösen Services den
// zugehörigen, nutzerfreundlichen `message`-Text vorerst selbst über eine lokale Zuordnungstabelle auf
// (siehe z. B. src/services/AuthService.ts) — leicht austauschbar, sobald eine i18n-Lösung entschieden ist.
export type AppError = {
  code: string;
  messageKey: string;
  message: string;
  technicalMessage: string;
  context?: Record<string, unknown>;
};
