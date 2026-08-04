import { fireEvent, render, screen } from '@testing-library/react-native';

import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('zeigt die Fehlermeldung', () => {
    render(<ErrorState message="Etwas ist schiefgelaufen." />);

    expect(screen.getByText('Etwas ist schiefgelaufen.')).toBeTruthy();
  });

  it('zeigt keinen Retry-Button ohne onRetry', () => {
    render(<ErrorState message="Fehler" />);

    expect(screen.queryByText('Erneut versuchen')).toBeNull();
  });

  it('ruft onRetry beim Tippen auf den Retry-Button auf', () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Fehler" onRetry={onRetry} />);

    fireEvent.press(screen.getByText('Erneut versuchen'));

    expect(onRetry).toHaveBeenCalled();
  });
});
