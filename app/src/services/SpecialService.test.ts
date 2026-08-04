import { SpecialService } from './SpecialService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

describe('SpecialService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSpecials', () => {
    it('liefert nur aktive Specials, optional nach Location gefiltert', async () => {
      const builder = createQueryBuilderMock({ data: [], error: null });
      mockFrom.mockReturnValue(builder);

      await SpecialService.getSpecials({ locationId: 'loc-1' });

      expect(mockFrom).toHaveBeenCalledWith('specials');
      expect(builder.eq).toHaveBeenCalledWith('is_active', true);
      expect(builder.eq).toHaveBeenCalledWith('location_id', 'loc-1');
    });
  });

  describe('getActiveSpecials', () => {
    it('filtert Specials ohne end_date oder mit end_date in der Zukunft heraus, standortübergreifend', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const specials = [
        { id: 'special-1', end_date: null },
        { id: 'special-2', end_date: '2099-01-01' },
        { id: 'special-3', end_date: '2000-01-01' },
      ];
      const builder = createQueryBuilderMock({ data: specials, error: null });
      mockFrom.mockReturnValue(builder);

      const result = await SpecialService.getActiveSpecials();

      expect(builder.eq).not.toHaveBeenCalledWith('location_id', expect.anything());
      expect(result.map((special) => special.id)).toEqual(['special-1', 'special-2']);
      expect(
        result.every((special) => special.end_date === null || special.end_date >= today),
      ).toBe(true);
    });
  });

  describe('getActiveSpecialsForLocation', () => {
    it('delegiert an getActiveSpecials mit gesetzter locationId', async () => {
      const builder = createQueryBuilderMock({ data: [], error: null });
      mockFrom.mockReturnValue(builder);

      await SpecialService.getActiveSpecialsForLocation('loc-1');

      expect(builder.eq).toHaveBeenCalledWith('location_id', 'loc-1');
    });
  });
});
