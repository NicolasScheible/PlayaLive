import { render, screen } from '@testing-library/react-native';

import { OccupancyBadge } from './OccupancyBadge';

describe('OccupancyBadge', () => {
  it('zeigt „Keine Daten" ohne Level', () => {
    render(<OccupancyBadge level={null} />);

    expect(screen.getByLabelText('Keine Daten')).toBeTruthy();
  });

  it('zeigt das Textlabel je Level (Farbe wird nie allein verwendet)', () => {
    render(<OccupancyBadge level="high" />);

    expect(screen.getByLabelText('Sehr voll')).toBeTruthy();
  });

  it('markiert unsichere Einschätzungen als „Vorläufig"', () => {
    render(<OccupancyBadge level="low" isConfident={false} />);

    expect(screen.getByLabelText('Vorläufig: Wenig los')).toBeTruthy();
  });
});
