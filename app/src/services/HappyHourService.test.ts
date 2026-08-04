import { HappyHourService } from './HappyHourService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

describe('HappyHourService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHappyHours', () => {
    it('liefert nur aktive Happy Hours, optional nach Location gefiltert', async () => {
      const builder = createQueryBuilderMock({ data: [], error: null });
      mockFrom.mockReturnValue(builder);

      await HappyHourService.getHappyHours({ locationId: 'loc-1' });

      expect(mockFrom).toHaveBeenCalledWith('happy_hours');
      expect(builder.eq).toHaveBeenCalledWith('is_active', true);
      expect(builder.eq).toHaveBeenCalledWith('location_id', 'loc-1');
    });
  });

  describe('getActiveHappyHours', () => {
    it('filtert nach dem heutigen Wochentag, standortübergreifend', async () => {
      const weekdays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const today = weekdays[new Date().getDay()];
      const builder = createQueryBuilderMock({ data: [], error: null });
      mockFrom.mockReturnValue(builder);

      await HappyHourService.getActiveHappyHours();

      expect(builder.eq).not.toHaveBeenCalledWith('location_id', expect.anything());
      expect(builder.eq).toHaveBeenCalledWith('weekday', today);
    });
  });

  describe('getActiveHappyHoursForLocation', () => {
    it('delegiert an getActiveHappyHours mit gesetzter locationId', async () => {
      const builder = createQueryBuilderMock({ data: [], error: null });
      mockFrom.mockReturnValue(builder);

      await HappyHourService.getActiveHappyHoursForLocation('loc-1');

      expect(builder.eq).toHaveBeenCalledWith('location_id', 'loc-1');
    });
  });
});
