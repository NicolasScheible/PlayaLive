import { render, screen } from '@testing-library/react-native';

import { ReviewListItem } from './ReviewListItem';

describe('ReviewListItem', () => {
  it('zeigt Bewertung, Kommentar und relatives Datum', () => {
    const createdAt = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    render(<ReviewListItem rating={4} commentText="Super Laden!" createdAt={createdAt} />);

    expect(screen.getByLabelText('4.0 von 5 Sternen')).toBeTruthy();
    expect(screen.getByText('Super Laden!')).toBeTruthy();
    expect(screen.getByText('vor 15 Min.')).toBeTruthy();
  });

  it('zeigt keinen Kommentartext, wenn keiner vorhanden ist', () => {
    render(<ReviewListItem rating={5} commentText={null} createdAt={new Date().toISOString()} />);

    expect(screen.getByLabelText('5.0 von 5 Sternen')).toBeTruthy();
  });
});
