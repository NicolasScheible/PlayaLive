import {
  formatDate,
  formatDateFromTimestamp,
  formatRelativeTime,
  formatTime,
  formatTimeOfDay,
} from './formatDateTime';

describe('formatDateTime', () => {
  describe('formatTime', () => {
    it('formatiert eine ISO-Zeit als HH:MM mit führenden Nullen', () => {
      const date = new Date();
      date.setHours(9, 5, 0, 0);

      expect(formatTime(date.toISOString())).toBe('09:05');
    });
  });

  describe('formatTimeOfDay', () => {
    it('schneidet Sekunden von einem Postgres-time-String ab', () => {
      expect(formatTimeOfDay('18:30:00')).toBe('18:30');
    });
  });

  describe('formatDate', () => {
    it('formatiert ein Postgres-date im deutschen Format', () => {
      expect(formatDate('2026-08-04')).toBe('04.08.2026');
    });
  });

  describe('formatDateFromTimestamp', () => {
    it('formatiert eine ISO-Zeit im deutschen Datumsformat mit führenden Nullen', () => {
      const date = new Date();
      date.setFullYear(2026, 7, 4);
      date.setHours(21, 30, 0, 0);

      expect(formatDateFromTimestamp(date.toISOString())).toBe('04.08.2026');
    });
  });

  describe('formatRelativeTime', () => {
    const now = new Date('2026-08-07T12:00:00.000Z');

    it('zeigt „gerade eben" für unter einer Minute', () => {
      expect(formatRelativeTime('2026-08-07T11:59:40.000Z', now)).toBe('gerade eben');
    });

    it('zeigt Minuten für unter einer Stunde', () => {
      expect(formatRelativeTime('2026-08-07T11:45:00.000Z', now)).toBe('vor 15 Min.');
    });

    it('zeigt Stunden für unter einem Tag', () => {
      expect(formatRelativeTime('2026-08-07T09:00:00.000Z', now)).toBe('vor 3 Std.');
    });

    it('zeigt Tage (Singular) für genau einen Tag', () => {
      expect(formatRelativeTime('2026-08-06T12:00:00.000Z', now)).toBe('vor 1 Tag');
    });

    it('zeigt Tage (Plural) für mehrere Tage', () => {
      expect(formatRelativeTime('2026-08-03T12:00:00.000Z', now)).toBe('vor 4 Tagen');
    });
  });
});
