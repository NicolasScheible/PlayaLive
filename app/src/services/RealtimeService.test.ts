import { RealtimeService } from './RealtimeService';

const mockRemoveChannel = jest.fn();
const mockSubscribe = jest.fn();
const mockOn = jest.fn();
const mockChannel = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: {
    channel: (...args: unknown[]) => mockChannel(...args),
    removeChannel: (...args: unknown[]) => mockRemoveChannel(...args),
  },
}));

describe('RealtimeService', () => {
  let capturedCallback: (payload: { new: unknown }) => void;
  const fakeChannel = { id: 'fake-channel' };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    mockOn.mockImplementation((_type, _filter, callback) => {
      capturedCallback = callback;

      return { subscribe: mockSubscribe };
    });
    mockSubscribe.mockReturnValue(fakeChannel);
    mockChannel.mockReturnValue({ on: mockOn });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('subscribeToReports', () => {
    it('abonniert INSERT-Events auf public.reports', () => {
      RealtimeService.subscribeToReports(jest.fn());

      expect(mockChannel).toHaveBeenCalledWith('reports-live-updates');
      expect(mockOn).toHaveBeenCalledWith(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        expect.any(Function),
      );
      expect(mockSubscribe).toHaveBeenCalled();
    });

    it('bündelt mehrere kurz aufeinanderfolgende Events zu einem einzigen Batch-Aufruf (300ms Debounce)', () => {
      const onBatch = jest.fn();
      RealtimeService.subscribeToReports(onBatch);

      const reportA = { id: 'report-1' };
      const reportB = { id: 'report-2' };
      capturedCallback({ new: reportA });
      jest.advanceTimersByTime(100);
      capturedCallback({ new: reportB });

      expect(onBatch).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);

      expect(onBatch).toHaveBeenCalledTimes(1);
      expect(onBatch).toHaveBeenCalledWith([reportA, reportB]);
    });

    it('verarbeitet einen weiteren Batch nach Ablauf des vorherigen Debounce-Fensters separat', () => {
      const onBatch = jest.fn();
      RealtimeService.subscribeToReports(onBatch);

      capturedCallback({ new: { id: 'report-1' } });
      jest.advanceTimersByTime(300);
      capturedCallback({ new: { id: 'report-2' } });
      jest.advanceTimersByTime(300);

      expect(onBatch).toHaveBeenCalledTimes(2);
    });

    it('die Unsubscribe-Funktion entfernt den Channel und bricht einen laufenden Debounce-Timer ab', () => {
      const onBatch = jest.fn();
      const unsubscribe = RealtimeService.subscribeToReports(onBatch);

      capturedCallback({ new: { id: 'report-1' } });
      unsubscribe();
      jest.advanceTimersByTime(300);

      expect(onBatch).not.toHaveBeenCalled();
      expect(mockRemoveChannel).toHaveBeenCalledWith(fakeChannel);
    });
  });
});
