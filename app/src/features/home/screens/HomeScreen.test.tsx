import { fireEvent, render, screen } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';

import { HomeScreen } from './HomeScreen';

const mockOnRefresh = jest.fn();

const emptySectionState = { isLoading: false, isError: false, error: null };

jest.mock('../hooks/useHomeDashboard', () => ({
  useHomeDashboard: () => ({
    greeting: { greeting: 'Guten Abend', displayName: 'Lisa' },
    weather: { weather: null, ...emptySectionState },
    liveOccupancy: { occupancies: [], ...emptySectionState },
    todayHighlights: { events: [], ...emptySectionState },
    currentActs: { acts: [], ...emptySectionState },
    nextAct: { nextAct: null, ...emptySectionState },
    happyHours: { happyHours: [], ...emptySectionState },
    specials: { specials: [], ...emptySectionState },
    isRefreshing: false,
    onRefresh: mockOnRefresh,
  }),
}));

describe('HomeScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('zeigt Header, Begrüßung, Wetter-Widget und alle Section-Überschriften', () => {
    render(<HomeScreen />);

    expect(screen.getByLabelText('PlayaLive')).toBeTruthy();
    expect(screen.getByText('Guten Abend, Lisa!')).toBeTruthy();
    expect(screen.getByText('LIVE AUSLASTUNG')).toBeTruthy();
    expect(screen.getByText('HIGHLIGHTS HEUTE')).toBeTruthy();
    expect(screen.getByText('SPIELT GERADE')).toBeTruthy();
    expect(screen.getByText('NÄCHSTER ACT')).toBeTruthy();
    expect(screen.getByText('HAPPY HOURS')).toBeTruthy();
    expect(screen.getByText('SPECIALS')).toBeTruthy();
    expect(screen.getByText('Zur Karte')).toBeTruthy();
  });

  it('ruft onRefresh beim Pull-to-Refresh auf', () => {
    render(<HomeScreen />);

    fireEvent(screen.UNSAFE_getByType(RefreshControl), 'refresh');

    expect(mockOnRefresh).toHaveBeenCalled();
  });
});
