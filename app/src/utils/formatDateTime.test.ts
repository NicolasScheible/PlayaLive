import { formatDate, formatTime, formatTimeOfDay } from './formatDateTime';

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
});
