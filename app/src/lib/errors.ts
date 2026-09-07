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

// Generisches Fehler-Mapping für den Datenzugriff über Supabase/Postgrest (siehe
// docs/Architecture.md Kapitel 15, Fehlercode-Katalog-Beispiele: NETWORK_OFFLINE, SERVER_ERROR,
// UNKNOWN_ERROR, LOCATION_NOT_FOUND, EVENT_NOT_FOUND, REPORT_RATE_LIMITED, REPORT_GEOFENCE_TOO_FAR).
// Auth-spezifisches Mapping bleibt in src/services/AuthService.ts (dort werden Supabase-Auth-Fehler
// bereits domänenspezifisch übersetzt).
const DATABASE_ERROR_MESSAGES = {
  NOT_FOUND: 'Der angeforderte Eintrag wurde nicht gefunden.',
  ALREADY_EXISTS: 'Dieser Eintrag existiert bereits.',
  PERMISSION_DENIED: 'Du hast keine Berechtigung für diese Aktion.',
  REPORT_RATE_LIMITED: 'Du hast diese Location gerade erst gemeldet. Bitte warte kurz.',
  REPORT_GEOFENCE_TOO_FAR: 'Du befindest dich zu weit von dieser Location entfernt.',
  FAVORITE_INVALID_TARGET: 'Dieser Eintrag kann nicht favorisiert werden.',
  REVIEW_INVALID_TARGET: 'Dieser Eintrag kann nicht bewertet werden.',
  NETWORK_OFFLINE: 'Bitte überprüfe deine Internetverbindung.',
  SERVER_ERROR: 'Der Server ist aktuell nicht erreichbar. Bitte versuche es später erneut.',
  UNKNOWN_ERROR: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
} as const;

export type MapDatabaseErrorOptions = {
  // Domänenspezifischer Code/Text für „keine Zeile gefunden" (z. B. LOCATION_NOT_FOUND,
  // EVENT_NOT_FOUND — siehe docs/Architecture.md Kapitel 15), da PGRST116 selbst generisch ist.
  notFound?: { code: string; message: string };
};

function hasStringProperty<K extends string>(value: unknown, key: K): value is Record<K, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>)[key] === 'string'
  );
}

export function mapDatabaseError(error: unknown, options: MapDatabaseErrorOptions = {}): AppError {
  const rawMessage = hasStringProperty(error, 'message') ? error.message : '';

  const code = (() => {
    // Von den Trigger-Funktionen in supabase/migrations bewusst vorangestellte Codes (z. B.
    // enforce_report_submission_rules() in 20260804122730_reports.sql) — Postgres liefert für
    // `RAISE EXCEPTION` sonst nur die generische SQLSTATE P0001, die Rate-Limit- und
    // Geofencing-Fehler nicht voneinander unterscheidbar macht.
    if (rawMessage.startsWith('REPORT_RATE_LIMITED')) return 'REPORT_RATE_LIMITED';
    if (rawMessage.startsWith('REPORT_GEOFENCE_TOO_FAR')) return 'REPORT_GEOFENCE_TOO_FAR';
    if (rawMessage.startsWith('FAVORITE_INVALID_TARGET')) return 'FAVORITE_INVALID_TARGET';
    if (rawMessage.startsWith('REVIEW_INVALID_TARGET')) return 'REVIEW_INVALID_TARGET';

    const postgrestCode = hasStringProperty(error, 'code') ? error.code : undefined;

    switch (postgrestCode) {
      case '23505':
        return 'ALREADY_EXISTS';
      case '42501':
        return 'PERMISSION_DENIED';
      case 'PGRST116':
        return options.notFound?.code ?? 'NOT_FOUND';
      // PGRST205: Tabelle/View nicht im PostgREST-Schema-Cache gefunden (z. B. "Could not find the
      // table 'public.profiles' in the schema cache") — PGRST202 analog für eine RPC-Funktion. Deutet
      // fast immer auf ein Deployment-Problem hin (Migrationen nicht auf das verbundene Supabase-
      // Projekt angewendet, oder Schema-Cache seit einer manuellen Änderung nicht neu geladen), nicht
      // auf einen für Endnutzer behebbaren Zustand — daher SERVER_ERROR statt UNKNOWN_ERROR, damit die
      // UI-Meldung ehrlich bleibt („Server nicht erreichbar" statt „versuche es erneut", was hier nichts
      // bringen würde). `technicalMessage` behält den originalen PostgREST-Text für die Diagnose.
      case 'PGRST205':
      case 'PGRST202':
        return 'SERVER_ERROR';
      default:
        return error instanceof TypeError ? 'NETWORK_OFFLINE' : 'UNKNOWN_ERROR';
    }
  })();

  const message =
    (code === options.notFound?.code ? options.notFound?.message : undefined) ??
    (DATABASE_ERROR_MESSAGES as Record<string, string>)[code] ??
    DATABASE_ERROR_MESSAGES.UNKNOWN_ERROR;

  return {
    code,
    messageKey: `errors.database.${code}`,
    message,
    technicalMessage: rawMessage || String(error),
  };
}
