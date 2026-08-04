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

  describe('getActiveSpecialsForLocation', () => {
    it('filtert Specials ohne end_date oder mit end_date in der Zukunft heraus', async () => {
      const today = new Date().toISOString().slice(0, 10);
      const specials = [
        { id: 'special-1', end_date: null },
        { id: 'special-2', end_date: '2099-01-01' },
        { id: 'special-3', end_date: '2000-01-01' },
      ];
      mockFrom.mockReturnValue(createQueryBuilderMock({ data: specials, error: null }));

      const result = await SpecialService.getActiveSpecialsForLocation('loc-1');

      expect(result.map((special) => special.id)).toEqual(['special-1', 'special-2']);
      expect(
        result.every((special) => special.end_date === null || special.end_date >= today),
      ).toBe(true);
    });
  });
});
