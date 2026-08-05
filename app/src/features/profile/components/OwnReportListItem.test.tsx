import { render, screen } from '@testing-library/react-native';

import type { OwnReportWithLocationName } from '../hooks/useOwnReports';

import { OwnReportListItem } from './OwnReportListItem';

const report: OwnReportWithLocationName = {
  id: 'report-1',
  user_id: 'user-1',
  location_id: 'loc-1',
  occupancy_level: 'high',
  wait_time_minutes: 15,
  mood: 'Ausgelassen',
  music_genre: 'Techno',
  comment: 'Richtig voll heute.',
  latitude: 39.5,
  longitude: 2.6,
  created_at: new Date().toISOString(),
  locationName: 'Test Club',
};

describe('OwnReportListItem', () => {
  it('zeigt Location, Auslastung, Wartezeit, Stimmung, Musik und Kommentar', () => {
    render(<OwnReportListItem report={report} />);

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('≈ 15 Min. Wartezeit')).toBeTruthy();
    expect(screen.getByText('Stimmung: Ausgelassen')).toBeTruthy();
    expect(screen.getByText('Musik: Techno')).toBeTruthy();
    expect(screen.getByText('Richtig voll heute.')).toBeTruthy();
  });

  it('zeigt optionale Felder nicht, wenn sie fehlen', () => {
    render(
      <OwnReportListItem
        report={{
          ...report,
          wait_time_minutes: null,
          mood: null,
          music_genre: null,
          comment: null,
        }}
      />,
    );

    expect(screen.queryByText(/Wartezeit/)).toBeNull();
    expect(screen.queryByText(/Stimmung/)).toBeNull();
    expect(screen.queryByText(/Musik/)).toBeNull();
  });
});
