import { renderHook } from '@testing-library/react-native';
import { AppState } from 'react-native';

import { useQueryFocusManager } from './queryFocusManager';

const mockSetFocused = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  focusManager: { setFocused: (...args: unknown[]) => mockSetFocused(...args) },
}));

describe('useQueryFocusManager', () => {
  let addEventListenerSpy: jest.SpiedFunction<typeof AppState.addEventListener>;
  let mockRemove: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRemove = jest.fn();
    addEventListenerSpy = jest
      .spyOn(AppState, 'addEventListener')
      .mockReturnValue({ remove: mockRemove } as ReturnType<typeof AppState.addEventListener>);
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
  });

  it('registriert beim Mount einen AppState-Listener und entfernt ihn beim Unmount', () => {
    const { unmount } = renderHook(() => useQueryFocusManager());

    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  it('meldet der focusManager, dass die App wieder im Vordergrund ist', () => {
    renderHook(() => useQueryFocusManager());

    const listener = addEventListenerSpy.mock.calls[0][1];
    listener('active');

    expect(mockSetFocused).toHaveBeenCalledWith(true);
  });

  it('meldet der focusManager, dass die App in den Hintergrund gewechselt ist', () => {
    renderHook(() => useQueryFocusManager());

    const listener = addEventListenerSpy.mock.calls[0][1];
    listener('background');

    expect(mockSetFocused).toHaveBeenCalledWith(false);
  });
});
