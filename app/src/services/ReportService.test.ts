import { ReportService } from './ReportService';

const mockGetSession = jest.fn();
const mockInsertReport = jest.fn();
const mockFindOwnReports = jest.fn();
const mockFindLiveStatus = jest.fn();
const mockInsertReportFlag = jest.fn();

jest.mock('./AuthService', () => ({
  AuthService: { getSession: (...args: unknown[]) => mockGetSession(...args) },
}));

jest.mock('../repositories/ReportRepository', () => ({
  ReportRepository: {
    insertReport: (...args: unknown[]) => mockInsertReport(...args),
    findOwnReports: (...args: unknown[]) => mockFindOwnReports(...args),
    findLiveStatus: (...args: unknown[]) => mockFindLiveStatus(...args),
    insertReportFlag: (...args: unknown[]) => mockInsertReportFlag(...args),
  },
}));

const session = { user: { id: 'user-1' } };
const validInput = {
  locationId: 'loc-1',
  occupancyLevel: 'high' as const,
  latitude: 39.5,
  longitude: 2.63,
};

describe('ReportService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createReport', () => {
    it('lehnt ungültige Eingaben ab, ohne das Repository aufzurufen', async () => {
      mockGetSession.mockResolvedValue({ session });

      await expect(
        ReportService.createReport({ ...validInput, latitude: 999 }),
      ).rejects.toMatchObject({ code: 'VALIDATION_ERROR' });
      expect(mockInsertReport).not.toHaveBeenCalled();
    });

    it('wirft AUTH_SESSION_MISSING ohne aktive Session', async () => {
      mockGetSession.mockResolvedValue({ session: null });

      await expect(ReportService.createReport(validInput)).rejects.toMatchObject({
        code: 'AUTH_SESSION_MISSING',
      });
    });

    it('ruft das Repository mit der Nutzer-ID aus der Session auf', async () => {
      mockGetSession.mockResolvedValue({ session });
      const report = { id: 'report-1', ...validInput };
      mockInsertReport.mockResolvedValue(report);

      const result = await ReportService.createReport(validInput);

      expect(mockInsertReport).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: 'user-1', location_id: 'loc-1' }),
      );
      expect(result).toEqual(report);
    });

    it('übersetzt einen REPORT_RATE_LIMITED-Fehler aus dem Repository', async () => {
      mockGetSession.mockResolvedValue({ session });
      mockInsertReport.mockRejectedValue({ message: 'REPORT_RATE_LIMITED: ...', code: 'P0001' });

      await expect(ReportService.createReport(validInput)).rejects.toMatchObject({
        code: 'REPORT_RATE_LIMITED',
      });
    });
  });

  describe('getLiveStatus', () => {
    it('liest den Live-Status ohne Session-Pflicht', async () => {
      const status = { location_id: 'loc-1', occupancy_level: 'high' };
      mockFindLiveStatus.mockResolvedValue(status);

      const result = await ReportService.getLiveStatus('loc-1');

      expect(mockGetSession).not.toHaveBeenCalled();
      expect(result).toEqual(status);
    });
  });

  describe('flagReport', () => {
    it('meldet einen Report mit der Nutzer-ID aus der Session', async () => {
      mockGetSession.mockResolvedValue({ session });
      mockInsertReportFlag.mockResolvedValue({ id: 'flag-1' });

      await ReportService.flagReport({ reportId: 'report-1', reason: 'Spam' });

      expect(mockInsertReportFlag).toHaveBeenCalledWith({
        report_id: 'report-1',
        flagged_by_user_id: 'user-1',
        reason: 'Spam',
      });
    });
  });
});
