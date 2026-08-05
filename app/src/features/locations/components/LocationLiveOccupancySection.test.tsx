import { render, screen } from '@testing-library/react-native';

import { LocationLiveOccupancySection } from './LocationLiveOccupancySection';

describe('LocationLiveOccupancySection', () => {
  it('zeigt die Auslastung, Wartezeit und letzte Aktualisierung', () => {
    render(
      <LocationLiveOccupancySection
        liveStatus={{
          location_id: 'loc-1',
          occupancy_level: 'medium',
          report_count: 4,
          is_confident: true,
          wait_time_minutes: 10,
          last_reported_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        }}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByLabelText('Gut besucht')).toBeTruthy();
    expect(screen.getByText('≈ 10 Min. Wartezeit')).toBeTruthy();
    expect(screen.getByText('Letzte Aktualisierung: vor 5 Min.')).toBeTruthy();
  });

  it('zeigt einen Ladezustand', () => {
    render(
      <LocationLiveOccupancySection liveStatus={null} isLoading isError={false} error={null} />,
    );

    expect(screen.getByText('LIVE-AUSLASTUNG')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <LocationLiveOccupancySection
        liveStatus={null}
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

  it('zeigt einen Empty State ohne Meldungen', () => {
    render(
      <LocationLiveOccupancySection
        liveStatus={null}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('Noch keine Meldungen für diese Location.')).toBeTruthy();
  });
});
