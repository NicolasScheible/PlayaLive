import { render, screen } from '@testing-library/react-native';

import { LocationDetailScreen } from './LocationDetailScreen';

describe('LocationDetailScreen', () => {
  it('zeigt die übergebene Location-ID als Platzhalterinhalt', () => {
    render(
      // @ts-expect-error nur die für den Platzhalter relevanten Props werden im Test gestellt
      <LocationDetailScreen route={{ params: { locationId: 'loc-1' } }} />,
    );

    expect(screen.getByText('Location-Details folgen in Kürze.')).toBeTruthy();
    expect(screen.getByText('loc-1')).toBeTruthy();
  });
});
