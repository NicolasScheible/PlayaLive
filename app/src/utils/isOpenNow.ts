import type { OpeningHoursWindow, Weekday } from '../types/entities';

// Wertet `locations.opening_hours` nach dem in docs/Database.md 2.3 festgelegten Schema aus (siehe
// dort für die vollständige Begründung/ein Beispiel). Eigene, lokale Wochentags-Reihenfolge statt
// Import aus HappyHourService.ts, da diese dort nicht exportiert ist (kein Kopplungsgewinn für eine
// siebenelementige Konstante).
const WEEKDAYS: readonly Weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function isValidWindow(value: unknown): value is OpeningHoursWindow {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { open?: unknown }).open === 'string' &&
    typeof (value as { close?: unknown }).close === 'string'
  );
}

function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

// Fehlende/ungültige Daten gelten als NICHT zweifelsfrei geöffnet (docs/Database.md 2.3: „gilt die
// Location ... als nicht zweifelsfrei geöffnet") — der Filter schließt sie aus, statt fälschlich
// „geöffnet" zu behaupten.
export function isOpenNow(openingHours: unknown, now: Date = new Date()): boolean {
  if (typeof openingHours !== 'object' || openingHours === null) {
    return false;
  }

  const schedule = openingHours as Record<string, unknown>;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const todayWindow = schedule[WEEKDAYS[now.getDay()]];

  if (isValidWindow(todayWindow)) {
    const openMinutes = timeStringToMinutes(todayWindow.open);
    const closeMinutes = timeStringToMinutes(todayWindow.close);

    if (closeMinutes > openMinutes) {
      if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
        return true;
      }
    } else if (nowMinutes >= openMinutes) {
      // Übernacht-Öffnungszeit (z. B. 22:00–04:00): von open bis Mitternacht gehört noch zu heute.
      return true;
    }
  }

  // Gestriges Übernacht-Fenster kann bis in den heutigen Tag hineinreichen (z. B. Freitag 23:00–06:00
  // ist am Samstagmorgen um 03:00 noch geöffnet — maßgeblich ist dann Freitags Eintrag, nicht Samstags).
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayWindow = schedule[WEEKDAYS[yesterday.getDay()]];

  if (isValidWindow(yesterdayWindow)) {
    const openMinutes = timeStringToMinutes(yesterdayWindow.open);
    const closeMinutes = timeStringToMinutes(yesterdayWindow.close);

    if (closeMinutes <= openMinutes && nowMinutes < closeMinutes) {
      return true;
    }
  }

  return false;
}
