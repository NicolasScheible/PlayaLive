import { ReportRepository } from './ReportRepository';

const mockFrom = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

function createBuilder(result: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  ['select', 'insert', 'eq', 'order'].forEach((method) => {
    builder[method] = jest.fn(() => builder);
  });
  builder.single = jest.fn().mockResolvedValue(result);
  builder.maybeSingle = jest.fn().mockResolvedValue(result);
  builder.then = (resolve: (value: typeof result) => unknown) =>
    Promise.resolve(result).then(resolve);

  return builder;
}

describe('ReportRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('insertReport gibt die eingefügte Zeile zurück', async () => {
    const row = { id: 'report-1', location_id: 'loc-1' };
    mockFrom.mockReturnValue(createBuilder({ data: row, error: null }));

    const result = await ReportRepository.insertReport({
      user_id: 'user-1',
      location_id: 'loc-1',
      occupancy_level: 'high',
      latitude: 39.5,
      longitude: 2.63,
    });

    expect(mockFrom).toHaveBeenCalledWith('reports');
    expect(result).toEqual(row);
  });

  it('insertReport wirft den rohen Postgrest-Fehler unverändert (Mapping übernimmt der Service)', async () => {
    const rawError = { message: 'REPORT_RATE_LIMITED: ...', code: 'P0001' };
    mockFrom.mockReturnValue(createBuilder({ data: null, error: rawError }));

    await expect(
      ReportRepository.insertReport({
        user_id: 'user-1',
        location_id: 'loc-1',
        occupancy_level: 'high',
        latitude: 39.5,
        longitude: 2.63,
      }),
    ).rejects.toBe(rawError);
  });

  it('findLiveStatus liest aus der location_live_status-View', async () => {
    const status = { location_id: 'loc-1', occupancy_level: 'high' };
    mockFrom.mockReturnValue(createBuilder({ data: status, error: null }));

    const result = await ReportRepository.findLiveStatus('loc-1');

    expect(mockFrom).toHaveBeenCalledWith('location_live_status');
    expect(result).toEqual(status);
  });
});
