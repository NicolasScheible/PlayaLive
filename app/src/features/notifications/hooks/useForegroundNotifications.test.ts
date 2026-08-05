import { renderHook } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { useForegroundNotifications } from './useForegroundNotifications';

const mockOnForegroundMessage = jest.fn();
const mockParseNotificationTarget = jest.fn();
const mockNavigate = jest.fn();
const mockIsReady = jest.fn();

jest.mock('../../../navigation/navigationRef', () => ({
  navigationRef: {
    isReady: () => mockIsReady(),
    navigate: (...args: unknown[]) => mockNavigate(...args),
  },
}));

jest.mock('../../../services/NotificationService', () => ({
  NotificationService: {
    onForegroundMessage: (...args: unknown[]) => mockOnForegroundMessage(...args),
    parseNotificationTarget: (...args: unknown[]) => mockParseNotificationTarget(...args),
  },
}));

function renderAndCapture() {
  let listener: (message: unknown) => void = () => undefined;
  mockOnForegroundMessage.mockImplementation((givenListener) => {
    listener = givenListener;

    return jest.fn();
  });

  renderHook(() => useForegroundNotifications());

  return (message: unknown) => listener(message);
}

describe('useForegroundNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsReady.mockReturnValue(true);
  });

  it('zeigt Titel und Text der Notification über Alert an', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    mockParseNotificationTarget.mockReturnValue(null);
    const emit = renderAndCapture();

    emit({ notification: { title: 'Neues Event', body: 'Gleich geht es los' } });

    expect(alertSpy).toHaveBeenCalledWith('Neues Event', 'Gleich geht es los', undefined);
  });

  it('bietet bei einem bekannten Bezugsobjekt eine „Anzeigen"-Aktion an, die navigiert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    mockParseNotificationTarget.mockReturnValue({ type: 'location', id: 'loc-1' });
    const emit = renderAndCapture();

    emit({ notification: { title: 'Deine Location', body: 'Wird gerade voll' } });

    const buttons = alertSpy.mock.calls[0][2] as { text: string; onPress?: () => void }[];
    const showButton = buttons.find((button) => button.text === 'Anzeigen');
    showButton?.onPress?.();

    expect(mockNavigate).toHaveBeenCalledWith('LocationDetail', { locationId: 'loc-1' });
  });

  it('meldet sich beim Unmount ab', () => {
    const unsubscribe = jest.fn();
    mockOnForegroundMessage.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useForegroundNotifications());
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
