import { render, screen } from '@testing-library/react-native';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('zeigt die übergebene Meldung', () => {
    render(<EmptyState message="Aktuell keine Einträge." />);

    expect(screen.getByText('Aktuell keine Einträge.')).toBeTruthy();
  });
});
