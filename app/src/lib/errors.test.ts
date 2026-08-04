import { mapDatabaseError } from './errors';

describe('mapDatabaseError', () => {
  it('erkennt REPORT_RATE_LIMITED am Trigger-Präfix', () => {
    const result = mapDatabaseError({
      message:
        'REPORT_RATE_LIMITED: Bereits ein Report für diese Location in den letzten 10 Minuten.',
      code: 'P0001',
    });

    expect(result.code).toBe('REPORT_RATE_LIMITED');
    expect(result.message).toBe('Du hast diese Location gerade erst gemeldet. Bitte warte kurz.');
  });

  it('erkennt REPORT_GEOFENCE_TOO_FAR am Trigger-Präfix', () => {
    const result = mapDatabaseError({
      message: 'REPORT_GEOFENCE_TOO_FAR: Zu weit von der Location entfernt.',
      code: 'P0001',
    });

    expect(result.code).toBe('REPORT_GEOFENCE_TOO_FAR');
  });

  it('erkennt FAVORITE_INVALID_TARGET am Trigger-Präfix', () => {
    const result = mapDatabaseError({
      message: 'FAVORITE_INVALID_TARGET: Location xyz existiert nicht oder ist gelöscht.',
      code: 'P0001',
    });

    expect(result.code).toBe('FAVORITE_INVALID_TARGET');
  });

  it('übersetzt einen Unique-Constraint-Verstoß (23505) in ALREADY_EXISTS', () => {
    const result = mapDatabaseError({ message: 'duplicate key value', code: '23505' });

    expect(result.code).toBe('ALREADY_EXISTS');
  });

  it('übersetzt eine RLS-Verletzung (42501) in PERMISSION_DENIED', () => {
    const result = mapDatabaseError({
      message: 'new row violates row-level security policy',
      code: '42501',
    });

    expect(result.code).toBe('PERMISSION_DENIED');
  });

  it('übersetzt PGRST116 mit generischem NOT_FOUND ohne notFound-Option', () => {
    const result = mapDatabaseError({ message: 'no rows', code: 'PGRST116' });

    expect(result.code).toBe('NOT_FOUND');
  });

  it('übersetzt PGRST116 mit domänenspezifischem Code, wenn notFound angegeben ist', () => {
    const result = mapDatabaseError(
      { message: 'no rows', code: 'PGRST116' },
      { notFound: { code: 'LOCATION_NOT_FOUND', message: 'Diese Location wurde nicht gefunden.' } },
    );

    expect(result.code).toBe('LOCATION_NOT_FOUND');
    expect(result.message).toBe('Diese Location wurde nicht gefunden.');
  });

  it('übersetzt einen TypeError als NETWORK_OFFLINE', () => {
    const result = mapDatabaseError(new TypeError('Network request failed'));

    expect(result.code).toBe('NETWORK_OFFLINE');
  });

  it('fällt auf UNKNOWN_ERROR zurück, wenn nichts erkannt wird', () => {
    const result = mapDatabaseError({ message: 'etwas Unerwartetes', code: 'XX000' });

    expect(result.code).toBe('UNKNOWN_ERROR');
  });
});
