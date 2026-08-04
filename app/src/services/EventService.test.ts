import { EventService } from './EventService';
import { createQueryBuilderMock } from './testUtils';

const mockFrom = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

describe('EventService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getUpcomingEvents filtert optional nach Location und Zeitraum', async () => {
    const builder = createQueryBuilderMock({ data: [], error: null });
    mockFrom.mockReturnValue(builder);

    await EventService.getUpcomingEvents({ locationId: 'loc-1', to: '2026-12-31T00:00:00.000Z' });

    expect(builder.eq).toHaveBeenCalledWith('location_id', 'loc-1');
    expect(builder.lte).toHaveBeenCalledWith('start_time', '2026-12-31T00:00:00.000Z');
  });

  it('getEventById gibt null zurück, wenn das Event nicht existiert', async () => {
    mockFrom.mockReturnValue(createQueryBuilderMock({ data: null, error: null }));

    const result = await EventService.getEventById('missing');

    expect(result).toBeNull();
  });

  it('getEventById kombiniert Event, Location und Artists', async () => {
    const event = { id: 'event-1', location_id: 'loc-1', title: 'Test Event' };
    const location = { id: 'loc-1', name: 'Test Club' };
    const artists = [{ id: 'artist-1', name: 'DJ Test' }];

    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock({ data: event, error: null }))
      .mockReturnValueOnce(createQueryBuilderMock({ data: location, error: null }))
      .mockReturnValueOnce(
        createQueryBuilderMock({ data: [{ artist_id: 'artist-1' }], error: null }),
      )
      .mockReturnValueOnce(createQueryBuilderMock({ data: artists, error: null }));

    const result = await EventService.getEventById('event-1');

    expect(result).toEqual({ ...event, location, artists });
  });

  it('getEventById wirft LOCATION_NOT_FOUND, wenn die referenzierte Location fehlt', async () => {
    const event = { id: 'event-1', location_id: 'loc-missing', title: 'Test Event' };

    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock({ data: event, error: null }))
      .mockReturnValueOnce(createQueryBuilderMock({ data: null, error: null }));

    await expect(EventService.getEventById('event-1')).rejects.toMatchObject({
      code: 'LOCATION_NOT_FOUND',
    });
  });
});
