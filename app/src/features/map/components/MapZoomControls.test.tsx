import { fireEvent, render, screen } from '@testing-library/react-native';

import { MapZoomControls } from './MapZoomControls';

describe('MapZoomControls', () => {
  it('ruft onZoomIn/onZoomOut beim Tippen auf', () => {
    const onZoomIn = jest.fn();
    const onZoomOut = jest.fn();

    render(<MapZoomControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} />);

    fireEvent.press(screen.getByLabelText('Näher heranzoomen'));
    fireEvent.press(screen.getByLabelText('Weiter herauszoomen'));

    expect(onZoomIn).toHaveBeenCalledTimes(1);
    expect(onZoomOut).toHaveBeenCalledTimes(1);
  });
});
