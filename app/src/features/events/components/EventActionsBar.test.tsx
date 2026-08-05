import { fireEvent, render, screen } from '@testing-library/react-native';

import { EventActionsBar } from './EventActionsBar';

describe('EventActionsBar', () => {
  it('ruft onPressRoute beim Tippen auf „Route öffnen" auf', () => {
    const onPressRoute = jest.fn();

    render(<EventActionsBar onPressRoute={onPressRoute} />);

    fireEvent.press(screen.getByText('Route öffnen'));

    expect(onPressRoute).toHaveBeenCalledTimes(1);
  });
});
