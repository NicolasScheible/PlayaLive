import { LocationService } from './LocationService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

describe('LocationService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocations', () => {
    it('gibt die Location-Liste zurück', async () => {
      const locations = [{ id: 'loc-1', name: 'Test Club' }];
      mockFrom.mockReturnValue(createQueryBuilderMock({ data: locations, error: null }));

      const result = await LocationService.getLocations();

      expect(mockFrom).toHaveBeenCalledWith('locations');
      expect(result).toEqual(locations);
    });

    it('wirft einen gemappten Fehler bei einem Datenbankfehler', async () => {
      mockFrom.mockReturnValue(
        createQueryBuilderMock({ data: null, error: { message: 'boom', code: 'XX000' } }),
      );

      await expect(LocationService.getLocations()).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' });
    });
  });

  describe('getLocationById', () => {
    it('gibt null zurück, wenn die Location nicht existiert', async () => {
      mockFrom.mockReturnValue(createQueryBuilderMock({ data: null, error: null }));

      const result = await LocationService.getLocationById('missing-id');

      expect(result).toBeNull();
    });

    it('kombiniert Location und Live-Status', async () => {
      const location = { id: 'loc-1', name: 'Test Club' };
      const liveStatus = { location_id: 'loc-1', occupancy_level: 'high' };
      mockFrom
        .mockReturnValueOnce(createQueryBuilderMock({ data: location, error: null }))
        .mockReturnValueOnce(createQueryBuilderMock({ data: liveStatus, error: null }));

      const result = await LocationService.getLocationById('loc-1');

      expect(result).toEqual({ ...location, liveStatus });
    });
  });

  describe('getLocationsNearby', () => {
    it('filtert über eine Bounding-Box um die übergebene Koordinate', async () => {
      const builder = createQueryBuilderMock({ data: [], error: null });
      mockFrom.mockReturnValue(builder);

      await LocationService.getLocationsNearby({
        latitude: 39.5,
        longitude: 2.63,
        radiusMeters: 150,
      });

      expect(builder.gte).toHaveBeenCalled();
      expect(builder.lte).toHaveBeenCalled();
    });
  });
});
