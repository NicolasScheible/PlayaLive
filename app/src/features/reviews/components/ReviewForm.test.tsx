import { fireEvent, render, screen } from '@testing-library/react-native';

import { ReviewForm } from './ReviewForm';

describe('ReviewForm', () => {
  it('ruft onChangeRating beim Tippen auf einen Stern auf', () => {
    const onChangeRating = jest.fn();

    render(
      <ReviewForm
        rating={0}
        onChangeRating={onChangeRating}
        commentText=""
        onChangeCommentText={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
        submitLabel="Bewertung abgeben"
      />,
    );

    fireEvent.press(screen.getByLabelText('3 Sterne'));

    expect(onChangeRating).toHaveBeenCalledWith(3);
  });

  it('zeigt einen Fehler zur Sternebewertung', () => {
    render(
      <ReviewForm
        rating={0}
        onChangeRating={jest.fn()}
        commentText=""
        onChangeCommentText={jest.fn()}
        ratingError="Bitte wähle eine Sternebewertung aus."
        onSubmit={jest.fn()}
        isSubmitting={false}
        submitLabel="Bewertung abgeben"
      />,
    );

    expect(screen.getByText('Bitte wähle eine Sternebewertung aus.')).toBeTruthy();
  });

  it('ruft onSubmit beim Tippen auf den Button auf', () => {
    const onSubmit = jest.fn();

    render(
      <ReviewForm
        rating={4}
        onChangeRating={jest.fn()}
        commentText="Klasse!"
        onChangeCommentText={jest.fn()}
        onSubmit={onSubmit}
        isSubmitting={false}
        submitLabel="Speichern"
      />,
    );

    fireEvent.press(screen.getByText('Speichern'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
