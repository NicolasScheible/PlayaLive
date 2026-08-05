import { render, screen } from '@testing-library/react-native';

import { ReportSuccessState } from './ReportSuccessState';

describe('ReportSuccessState', () => {
  it('zeigt eine Erfolgsmeldung', () => {
    render(<ReportSuccessState />);

    expect(screen.getByText('Danke für deine Meldung!')).toBeTruthy();
  });
});
