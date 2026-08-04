import { render, screen } from '@testing-library/react-native';

import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
  it('rendert ohne Label', () => {
    const { toJSON } = render(<LoadingState />);

    expect(toJSON()).toBeTruthy();
  });

  it('zeigt ein optionales Label', () => {
    render(<LoadingState label="Karte wird geladen" />);

    expect(screen.getByText('Karte wird geladen')).toBeTruthy();
  });
});
