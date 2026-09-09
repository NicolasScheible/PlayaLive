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

  it('übersetzt eine fehlende Tabelle im Schema-Cache (PGRST205) als SERVER_ERROR', () => {
    const result = mapDatabaseError({
      message: "Could not find the table 'public.profiles' in the schema cache",
      code: 'PGRST205',
    });

    expect(result.code).toBe('SERVER_ERROR');
    expect(result.message).toBe(
      'Der Server ist aktuell nicht erreichbar. Bitte versuche es später erneut.',
    );
    expect(result.technicalMessage).toBe(
      "Could not find the table 'public.profiles' in the schema cache",
    );
  });

  it('übersetzt eine fehlende Funktion im Schema-Cache (PGRST202) als SERVER_ERROR', () => {
    const result = mapDatabaseError({ message: 'Could not find the function', code: 'PGRST202' });

    expect(result.code).toBe('SERVER_ERROR');
  });

  it('übersetzt einen TypeError als NETWORK_OFFLINE', () => {
    const result = mapDatabaseError(new TypeError('Network request failed'));

    expect(result.code).toBe('NETWORK_OFFLINE');
  });

  it('fällt auf UNKNOWN_ERROR zurück, wenn nichts erkannt wird', () => {
    const result = mapDatabaseError({ message: 'etwas Unerwartetes', code: 'XX000' });

    expect(result.code).toBe('UNKNOWN_ERROR');
  });

  describe('Logging der technischen Ursache (Auftrag „Fehleranzeige verbessern")', () => {
    let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('loggt die technische Ursache für den undurchsichtigen Sammel-Code SERVER_ERROR (z. B. PGRST205)', () => {
      mapDatabaseError({
        message: "Could not find the table 'public.profiles' in the schema cache",
        code: 'PGRST205',
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[mapDatabaseError] SERVER_ERROR:',
        "Could not find the table 'public.profiles' in the schema cache",
      );
    });

    it('loggt NICHT bei fachlich eindeutigen, erwarteten Fehlercodes (z. B. REPORT_RATE_LIMITED)', () => {
      mapDatabaseError({
        message:
          'REPORT_RATE_LIMITED: Bereits ein Report für diese Location in den letzten 10 Minuten.',
        code: 'P0001',
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
