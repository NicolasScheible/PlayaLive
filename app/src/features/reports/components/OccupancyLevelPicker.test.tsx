import { fireEvent, render, screen } from '@testing-library/react-native';

import { OccupancyLevelPicker } from './OccupancyLevelPicker';

describe('OccupancyLevelPicker', () => {
  it('zeigt genau die drei erlaubten Auslastungsstufen', () => {
    render(<OccupancyLevelPicker value={null} onChange={jest.fn()} />);

    expect(screen.getByText('Wenig los')).toBeTruthy();
    expect(screen.getByText('Gut besucht')).toBeTruthy();
    expect(screen.getByText('Sehr voll')).toBeTruthy();
  });

  it('ruft onChange mit dem gewählten Level auf', () => {
    const onChange = jest.fn();

    render(<OccupancyLevelPicker value={null} onChange={onChange} />);

    fireEvent.press(screen.getByText('Sehr voll'));

    expect(onChange).toHaveBeenCalledWith('high');
  });
});
