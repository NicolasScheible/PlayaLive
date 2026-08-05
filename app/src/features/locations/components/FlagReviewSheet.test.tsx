import { fireEvent, render, screen } from '@testing-library/react-native';

import { FlagReviewSheet } from './FlagReviewSheet';

describe('FlagReviewSheet', () => {
  it('ruft onChangeReason beim Tippen ins Textfeld auf', () => {
    const onChangeReason = jest.fn();

    render(
      <FlagReviewSheet
        reason=""
        onChangeReason={onChangeReason}
        onSubmit={jest.fn()}
        isSubmitting={false}
      />,
    );

    fireEvent.changeText(
      screen.getByPlaceholderText('Warum meldest du diese Bewertung?'),
      'Beleidigend',
    );

    expect(onChangeReason).toHaveBeenCalledWith('Beleidigend');
  });

  it('zeigt einen Fehler zum Grund', () => {
    render(
      <FlagReviewSheet
        reason=""
        onChangeReason={jest.fn()}
        reasonError="Bitte gib einen Grund an."
        onSubmit={jest.fn()}
        isSubmitting={false}
      />,
    );

    expect(screen.getByText('Bitte gib einen Grund an.')).toBeTruthy();
  });

  it('ruft onSubmit beim Tippen auf Melden auf', () => {
    const onSubmit = jest.fn();

    render(
      <FlagReviewSheet
        reason="Beleidigend"
        onChangeReason={jest.fn()}
        onSubmit={onSubmit}
        isSubmitting={false}
      />,
    );

    fireEvent.press(screen.getByText('Melden'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
