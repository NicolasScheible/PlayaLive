import { render, screen } from '@testing-library/react-native';

import type { Location, LocationLiveStatus } from '../../../types/entities';

import { ReportLocationSummary } from './ReportLocationSummary';

const location: Location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club',
  address: null,
  latitude: 39.5,
  longitude: 2.6,
  opening_hours: null,
  images: [],
  is_sponsored: false,
  sponsored_until: null,
  owner_user_id: null,
  created_by: null,
  created_at: '',
  updated_at: '',
  deleted_at: null,
};

const liveStatus: LocationLiveStatus = {
  location_id: 'loc-1',
  report_count: 4,
  is_confident: true,
  wait_time_minutes: null,
  last_reported_at: new Date().toISOString(),
  occupancy_level: 'high',
};

describe('ReportLocationSummary', () => {
  it('zeigt Namen, Auslastung, letzte Meldung und Entfernung', () => {
    render(
      <ReportLocationSummary
        location={location}
        liveStatus={liveStatus}
        isLiveStatusLoading={false}
        distanceMeters={80}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText(/Letzte Meldung/)).toBeTruthy();
    expect(screen.getByText('80 m entfernt')).toBeTruthy();
  });

  it('zeigt keine Entfernung ohne bekannten Standort', () => {
    render(
      <ReportLocationSummary
        location={location}
        liveStatus={null}
        isLiveStatusLoading={false}
        distanceMeters={null}
      />,
    );

    expect(screen.queryByText(/entfernt/)).toBeNull();
  });
});
