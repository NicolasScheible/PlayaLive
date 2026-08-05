import { render, screen } from '@testing-library/react-native';

import type { OwnReportWithLocationName } from '../hooks/useOwnReports';

import { OwnReportsSection } from './OwnReportsSection';

const report: OwnReportWithLocationName = {
  id: 'report-1',
  user_id: 'user-1',
  location_id: 'loc-1',
  occupancy_level: 'high',
  wait_time_minutes: null,
  mood: null,
  music_genre: null,
  comment: null,
  latitude: 39.5,
  longitude: 2.6,
  created_at: new Date().toISOString(),
  locationName: 'Test Club',
};

describe('OwnReportsSection', () => {
  it('zeigt eigene Reports', () => {
    render(<OwnReportsSection reports={[report]} isLoading={false} isError={false} error={null} />);

    expect(screen.getByText('Test Club')).toBeTruthy();
  });

  it('zeigt einen Empty State ohne eigene Reports', () => {
    render(<OwnReportsSection reports={[]} isLoading={false} isError={false} error={null} />);

    expect(screen.getByText('Du hast noch keine Reports abgegeben.')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <OwnReportsSection
        reports={[]}
        isLoading={false}
        isError
        error={{
          code: 'ERR',
          messageKey: 'x',
          message: 'Fehler beim Laden',
          technicalMessage: 'x',
        }}
      />,
    );

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });
});
