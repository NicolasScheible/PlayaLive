import { render, screen } from '@testing-library/react-native';

import { GreetingHeader } from './GreetingHeader';

describe('GreetingHeader', () => {
  it('kombiniert Gruß und Anzeigename', () => {
    render(<GreetingHeader greeting="Guten Abend" displayName="Lisa" />);

    expect(screen.getByText('Guten Abend, Lisa!')).toBeTruthy();
  });

  it('zeigt nur den Gruß ohne Anzeigename', () => {
    render(<GreetingHeader greeting="Guten Abend" displayName={null} />);

    expect(screen.getByText('Guten Abend!')).toBeTruthy();
  });
});
