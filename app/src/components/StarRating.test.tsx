import { render, screen } from '@testing-library/react-native';

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
});
