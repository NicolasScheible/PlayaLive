import { fireEvent, render, screen } from '@testing-library/react-native';

import { LocationActionsBar } from './LocationActionsBar';

describe('LocationActionsBar', () => {
  it('ruft onPressRoute beim Tippen auf „Route öffnen" auf', () => {
    const onPressRoute = jest.fn();

    render(<LocationActionsBar onPressRoute={onPressRoute} />);

    fireEvent.press(screen.getByText('Route öffnen'));

    expect(onPressRoute).toHaveBeenCalledTimes(1);
  });
});
