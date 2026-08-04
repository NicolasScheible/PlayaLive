import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { CardImage } from './CardImage';

describe('CardImage', () => {
  it('zeigt einen Platzhalter mit dem ersten Buchstaben, wenn kein Bild vorhanden ist', () => {
    render(<CardImage imageUrl={null} fallbackLabel="Test Club" height={100} />);

    expect(screen.getByText('T')).toBeTruthy();
  });

  it('rendert Overlay-Inhalte über dem Bild', () => {
    render(
      <CardImage imageUrl={null} fallbackLabel="Test Club" height={100}>
        <Text>Overlay-Inhalt</Text>
      </CardImage>,
    );

    expect(screen.getByText('Overlay-Inhalt')).toBeTruthy();
  });
});
