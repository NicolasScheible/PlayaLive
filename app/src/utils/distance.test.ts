import { distanceMeters } from './distance';

describe('distanceMeters', () => {
  it('liefert 0 für identische Koordinaten', () => {
    expect(distanceMeters(39.5, 2.6, 39.5, 2.6)).toBe(0);
  });

  it('liefert ≈111.320 m für 1° Breitengrad-Unterschied (unabhängig von der Länge)', () => {
    expect(distanceMeters(0, 0, 1, 0)).toBeCloseTo(111320, 0);
  });

  it('liefert ≈111.320 m für 1° Längengrad-Unterschied am Äquator', () => {
    expect(distanceMeters(0, 0, 0, 1)).toBeCloseTo(111320, 0);
  });

  it('ist symmetrisch', () => {
    const a = distanceMeters(39.5079, 2.6467, 39.51, 2.65);
    const b = distanceMeters(39.51, 2.65, 39.5079, 2.6467);

    expect(a).toBeCloseTo(b, 5);
  });

  it('liefert eine plausibel kleine Distanz für nahe beieinanderliegende Playa-de-Palma-Koordinaten', () => {
    const distance = distanceMeters(39.5079, 2.6467, 39.509, 2.6475);

    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(200);
  });
});
