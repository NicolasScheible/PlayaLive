import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { BottomSheet } from './BottomSheet';

describe('BottomSheet', () => {
  it('rendert nichts, wenn visible=false', () => {
    const { toJSON } = render(
      <BottomSheet visible={false} onClose={jest.fn()}>
        <Text>Inhalt</Text>
      </BottomSheet>,
    );

    expect(toJSON()).toBeNull();
  });

  it('rendert die Kinder, wenn visible=true', () => {
    render(
      <BottomSheet visible onClose={jest.fn()}>
        <Text>Location-Vorschau</Text>
      </BottomSheet>,
    );

    expect(screen.getByText('Location-Vorschau')).toBeTruthy();
  });

  it('ruft onClose beim Tippen auf den Backdrop auf', () => {
    const onClose = jest.fn();
    render(
      <BottomSheet visible onClose={onClose}>
        <Text>Inhalt</Text>
      </BottomSheet>,
    );

    fireEvent.press(screen.getByTestId('bottom-sheet-backdrop', { includeHiddenElements: true }));

    expect(onClose).toHaveBeenCalled();
  });

  it('zeigt den Drag-Handle-Bereich', () => {
    render(
      <BottomSheet visible onClose={jest.fn()}>
        <Text>Inhalt</Text>
      </BottomSheet>,
    );

    expect(screen.getByTestId('bottom-sheet-drag-handle-area')).toBeTruthy();
  });
});
