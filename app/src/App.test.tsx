import { render, screen } from '@testing-library/react-native';

import App from './App';

describe('App', () => {
  it('routet ohne bestehende Session zum Login-Platzhalter', async () => {
    render(<App />);

    expect(await screen.findByText('Login')).toBeTruthy();
  });
});
