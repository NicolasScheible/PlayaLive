import { formatDistance } from './formatDistance';

describe('formatDistance', () => {
  it('zeigt Meter unter 1000m', () => {
    expect(formatDistance(350)).toBe('350 m');
  });

  it('rundet Meter', () => {
    expect(formatDistance(349.6)).toBe('350 m');
  });

  it('zeigt Kilometer ab 1000m mit einer Nachkommastelle', () => {
    expect(formatDistance(1234)).toBe('1.2 km');
  });
});
