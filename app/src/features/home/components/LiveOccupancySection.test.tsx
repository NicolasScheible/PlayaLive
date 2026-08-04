import { render, screen } from '@testing-library/react-native';

import type { Location, LocationLiveStatus } from '../../../types/entities';
import type { LocationOccupancy } from '../hooks/useLiveOccupancy';

import { LiveOccupancySection } from './LiveOccupancySection';

const location: Location = {
  id: 'loc-1',
  name: 'Test Club',
  description: null,
  category: 'club',
  address: null,
  latitude: null,
  longitude: null,
  opening_hours: null,
  images: [],
  is_sponsored: false,
  sponsored_until: null,
  owner_user_id: null,
  created_by: null,
  created_at: '2026-08-04T00:00:00.000Z',
  updated_at: '2026-08-04T00:00:00.000Z',
  deleted_at: null,
};

const liveStatus: LocationLiveStatus = {
  location_id: 'loc-1',
  report_count: 5,
  is_confident: true,
  wait_time_minutes: 10,
  last_reported_at: '2026-08-04T00:00:00.000Z',
  occupancy_level: 'high',
};

const occupancy: LocationOccupancy = { location, liveStatus };

describe('LiveOccupancySection', () => {
  it('zeigt einen Skeleton-Loader während des Ladens', () => {
    render(<LiveOccupancySection occupancies={[]} isLoading isError={false} error={null} />);

    expect(screen.getByLabelText('Live Auslastung wird geladen')).toBeTruthy();
  });

  it('zeigt eine Fehlermeldung bei isError', () => {
    render(
      <LiveOccupancySection
        occupancies={[]}
        isLoading={false}
        isError
        error={{ code: 'X', messageKey: 'x', message: 'Fehler beim Laden.', technicalMessage: 'x' }}
      />,
    );

    expect(screen.getByText('Fehler beim Laden.')).toBeTruthy();
  });

  it('zeigt einen Leerzustand ohne Locations', () => {
    render(
      <LiveOccupancySection occupancies={[]} isLoading={false} isError={false} error={null} />,
    );

    expect(screen.getByText('Aktuell keine Locations verfügbar.')).toBeTruthy();
  });

  it('zeigt eine LocationCard je Occupancy', () => {
    render(
      <LiveOccupancySection
        occupancies={[occupancy]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByLabelText('Sehr voll')).toBeTruthy();
  });
});
