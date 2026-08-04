import {
  isValidLatitude,
  isValidLongitude,
  isValidOccupancyLevel,
  isValidWaitTimeMinutes,
  validateCreateReportInput,
} from './reportValidation';

describe('isValidOccupancyLevel', () => {
  it('akzeptiert low/medium/high', () => {
    expect(isValidOccupancyLevel('low')).toBe(true);
    expect(isValidOccupancyLevel('medium')).toBe(true);
    expect(isValidOccupancyLevel('high')).toBe(true);
  });

  it('lehnt unbekannte Werte ab', () => {
    expect(isValidOccupancyLevel('very_high')).toBe(false);
  });
});

describe('isValidLatitude/isValidLongitude', () => {
  it('akzeptiert gültige Koordinaten', () => {
    expect(isValidLatitude(39.5)).toBe(true);
    expect(isValidLongitude(2.63)).toBe(true);
  });

  it('lehnt Koordinaten außerhalb des gültigen Bereichs ab', () => {
    expect(isValidLatitude(120)).toBe(false);
    expect(isValidLongitude(-200)).toBe(false);
  });
});

describe('isValidWaitTimeMinutes', () => {
  it('akzeptiert undefined (optional)', () => {
    expect(isValidWaitTimeMinutes(undefined)).toBe(true);
  });

  it('lehnt negative Werte ab', () => {
    expect(isValidWaitTimeMinutes(-5)).toBe(false);
  });
});

describe('validateCreateReportInput', () => {
  const validInput = {
    locationId: 'loc-1',
    occupancyLevel: 'high' as const,
    latitude: 39.5,
    longitude: 2.63,
  };

  it('liefert keine Fehler für gültige Eingaben', () => {
    expect(validateCreateReportInput(validInput)).toEqual([]);
  });

  it('sammelt mehrere Fehler gleichzeitig', () => {
    const errors = validateCreateReportInput({
      ...validInput,
      latitude: 999,
      waitTimeMinutes: -1,
    });

    expect(errors.length).toBe(2);
  });
});
