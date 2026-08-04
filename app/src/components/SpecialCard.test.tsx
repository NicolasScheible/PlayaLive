import { render, screen } from '@testing-library/react-native';

import { SpecialCard } from './SpecialCard';

describe('SpecialCard', () => {
  it('zeigt einen Datumsbereich, wenn end_date gesetzt ist', () => {
    render(
      <SpecialCard
        locationName="Test Club"
        title="Ladies Night"
        category="Party"
        startDate="2026-08-04"
        endDate="2026-08-05"
        imageUrl={null}
      />,
    );

    expect(screen.getByText('04.08.2026 – 05.08.2026 · Party')).toBeTruthy();
  });

  it('zeigt „ab <Datum>", wenn kein end_date gesetzt ist', () => {
    render(
      <SpecialCard
        locationName="Test Club"
        title="Ladies Night"
        category={null}
        startDate="2026-08-04"
        endDate={null}
        imageUrl={null}
      />,
    );

    expect(screen.getByText('ab 04.08.2026')).toBeTruthy();
  });
});
