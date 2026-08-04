import { isOpenNow } from './isOpenNow';

// Referenzdaten: 07.08.2026 = Freitag, 08.08.2026 = Samstag (siehe docs/Database.md 2.3 fürs Schema).
describe('isOpenNow', () => {
  it('liefert false ohne opening_hours (null)', () => {
    expect(isOpenNow(null, new Date(2026, 7, 7, 23, 30))).toBe(false);
  });

  it('liefert false bei ungültiger Struktur (kein Objekt)', () => {
    expect(isOpenNow('geöffnet', new Date(2026, 7, 7, 23, 30))).toBe(false);
  });

  it('liefert false, wenn der heutige Wochentag fehlt/null ist', () => {
    const schedule = { friday: null };

    expect(isOpenNow(schedule, new Date(2026, 7, 7, 23, 30))).toBe(false);
  });

  it('liefert true innerhalb eines Fensters am selben Tag (kein Übernacht-Fenster)', () => {
    const schedule = { friday: { open: '18:00', close: '20:00' } };

    expect(isOpenNow(schedule, new Date(2026, 7, 7, 19, 0))).toBe(true);
  });

  it('liefert false außerhalb eines Fensters am selben Tag', () => {
    const schedule = { friday: { open: '18:00', close: '20:00' } };

    expect(isOpenNow(schedule, new Date(2026, 7, 7, 21, 0))).toBe(false);
  });

  it('liefert true innerhalb eines Übernacht-Fensters vor Mitternacht (heutiger Eintrag)', () => {
    const schedule = { friday: { open: '23:00', close: '06:00' } };

    expect(isOpenNow(schedule, new Date(2026, 7, 7, 23, 30))).toBe(true);
  });

  it('liefert true innerhalb eines Übernacht-Fensters nach Mitternacht (gestriger Eintrag)', () => {
    const schedule = { friday: { open: '23:00', close: '06:00' } };

    // Samstag 03:00 — maßgeblich ist Freitags Übernacht-Fenster, nicht Samstags (fehlender) Eintrag.
    expect(isOpenNow(schedule, new Date(2026, 7, 8, 3, 0))).toBe(true);
  });

  it('liefert false nach Ende eines Übernacht-Fensters', () => {
    const schedule = { friday: { open: '23:00', close: '06:00' } };

    expect(isOpenNow(schedule, new Date(2026, 7, 8, 7, 0))).toBe(false);
  });

  it('liefert false bei fehlerhaftem Fenster-Objekt (fehlendes close)', () => {
    const schedule = { friday: { open: '23:00' } };

    expect(isOpenNow(schedule, new Date(2026, 7, 7, 23, 30))).toBe(false);
  });
});
