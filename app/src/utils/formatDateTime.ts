// Geteilte Zeit-/Datumsformatierung ohne Fremdbibliothek (keine neue Abhängigkeit, siehe CLAUDE.md →
// Architekturregeln). Bewusst kein `Intl`/`toLocaleTimeString` verwendet, um nicht von
// Locale-Daten-Verfügbarkeit der jeweiligen Hermes-Engine abhängig zu sein — feste, einfache
// Formatierung genügt für die im DesignSystem dokumentierten Anzeigen („Uhrzeiten", Kapitel 4).
function pad(value: number): string {
  return String(value).padStart(2, '0');
}

// Für timestamptz-Felder (z. B. `events.start_time`) — gibt die Uhrzeit in lokaler Zeit als „HH:MM".
export function formatTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);

  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Für Postgres-`time`-Felder ohne Datum (z. B. `happy_hours.start_time`), die PostgREST als
// „HH:MM:SS"-String liefert — kein `Date`-Parsing nötig/möglich, da kein Datum enthalten ist.
export function formatTimeOfDay(pgTime: string): string {
  return pgTime.slice(0, 5);
}

// Für Postgres-`date`-Felder (z. B. `specials.start_date`), PostgREST-Format „YYYY-MM-DD" — Anzeige
// im deutschen Format „DD.MM.YYYY".
export function formatDate(pgDate: string): string {
  const [year, month, day] = pgDate.split('-');

  return `${day}.${month}.${year}`;
}

// Relative Zeitangabe („vor 15 Min") gemäß docs/DesignSystem.md Kapitel 4 („Caption/Meta-Kleinstschrift
// ... z. B. „vor 15 Min""). `now` als Parameter statt fest `new Date()` für deterministische Tests.
export function formatRelativeTime(isoDateTime: string, now: Date = new Date()): string {
  const diffMinutes = Math.max(
    0,
    Math.round((now.getTime() - new Date(isoDateTime).getTime()) / 60000),
  );

  if (diffMinutes < 1) {
    return 'gerade eben';
  }

  if (diffMinutes < 60) {
    return `vor ${diffMinutes} Min.`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `vor ${diffHours} Std.`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `vor ${diffDays} Tag${diffDays === 1 ? '' : 'en'}`;
}
