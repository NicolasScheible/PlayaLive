import { ArtistService } from './ArtistService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

describe('ArtistService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getArtists gibt die Artist-Liste zurück', async () => {
    const artists = [{ id: 'artist-1', name: 'DJ Test' }];
    mockFrom.mockReturnValue(createQueryBuilderMock({ data: artists, error: null }));

    const result = await ArtistService.getArtists();

    expect(mockFrom).toHaveBeenCalledWith('artists');
    expect(result).toEqual(artists);
  });

  it('getArtistById gibt null zurück, wenn kein Artist gefunden wird', async () => {
    mockFrom.mockReturnValue(createQueryBuilderMock({ data: null, error: null }));

    const result = await ArtistService.getArtistById('missing');

    expect(result).toBeNull();
  });

  describe('getArtistEvents', () => {
    it('gibt ein leeres Array zurück, wenn keine Zuordnungen existieren', async () => {
      mockFrom.mockReturnValue(createQueryBuilderMock({ data: [], error: null }));

      const result = await ArtistService.getArtistEvents('artist-1');

      expect(result).toEqual([]);
    });

    it('lädt die zugeordneten Events über event_artists', async () => {
      const events = [{ id: 'event-1', title: 'Test Event' }];
      mockFrom
        .mockReturnValueOnce(
          createQueryBuilderMock({ data: [{ event_id: 'event-1' }], error: null }),
        )
        .mockReturnValueOnce(createQueryBuilderMock({ data: events, error: null }));

      const result = await ArtistService.getArtistEvents('artist-1');

      expect(mockFrom).toHaveBeenNthCalledWith(1, 'event_artists');
      expect(mockFrom).toHaveBeenNthCalledWith(2, 'events');
      expect(result).toEqual(events);
    });
  });
});
