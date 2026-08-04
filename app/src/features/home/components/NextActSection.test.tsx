import { render, screen } from '@testing-library/react-native';

import type { EventWithLocationName } from '../hooks/useCurrentActs';

import { NextActSection } from './NextActSection';

const nextAct: EventWithLocationName = {
  id: 'event-1',
  location_id: 'loc-1',
  title: 'Next Party',
  description: null,
  start_time: new Date().toISOString(),
  end_time: null,
  image_url: null,
  is_sponsored: false,
  created_by: null,
  created_at: '2026-08-04T00:00:00.000Z',
  updated_at: '2026-08-04T00:00:00.000Z',
  deleted_at: null,
  locationName: 'Test Club',
};

describe('NextActSection', () => {
  it('zeigt einen Skeleton-Loader während des Ladens', () => {
    render(<NextActSection nextAct={null} isLoading isError={false} error={null} />);

    expect(screen.queryByText('Next Party')).toBeNull();
  });

  it('zeigt eine Fehlermeldung bei isError', () => {
    render(
      <NextActSection
        nextAct={null}
        isLoading={false}
        isError
        error={{ code: 'X', messageKey: 'x', message: 'Fehler beim Laden.', technicalMessage: 'x' }}
      />,
    );

    expect(screen.getByText('Fehler beim Laden.')).toBeTruthy();
  });

  it('zeigt einen Leerzustand ohne bevorstehenden Act', () => {
    render(<NextActSection nextAct={null} isLoading={false} isError={false} error={null} />);

    expect(screen.getByText('Aktuell ist kein weiteres Event angekündigt.')).toBeTruthy();
  });

  it('zeigt den nächsten Act', () => {
    render(<NextActSection nextAct={nextAct} isLoading={false} isError={false} error={null} />);

    expect(screen.getByText('Next Party')).toBeTruthy();
    expect(screen.getByText('Test Club')).toBeTruthy();
  });
});
