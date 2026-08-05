import { fireEvent, render, screen } from '@testing-library/react-native';

import { StarRating } from './StarRating';

describe('StarRating', () => {
  it('beschriftet die Bewertung für Screenreader', () => {
    render(<StarRating rating={4.3} />);

    expect(screen.getByLabelText('4.3 von 5 Sternen')).toBeTruthy();
  });

  it('rundet auf ganze Sterne', () => {
    render(<StarRating rating={3.6} />);

    expect(screen.getByLabelText('3.6 von 5 Sternen')).toBeTruthy();
  });

  it('ruft onChange mit dem gewählten Wert auf, wenn interaktiv', () => {
    const onChange = jest.fn();
    render(<StarRating rating={0} onChange={onChange} />);

    fireEvent.press(screen.getByLabelText('4 Sterne'));

    expect(onChange).toHaveBeenCalledWith(4);
  });
});
